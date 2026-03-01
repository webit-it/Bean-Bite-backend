import QRCode from "qrcode";
import { randomUUID } from "crypto";
import { IQrRepository } from "../../interfaces/repository/qr.repository.interface";
import { toQrGenerateResponseDto } from "../../mappers/qr.mapper";
import { IQrService } from "../../interfaces/service/qr/qr.interface";
import AppError from "../../utils/AppError";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { ICustomerRewardProgressRepository } from "../../interfaces/repository/reward.progress.repository.interface";
import { IRewardRepository } from "../../interfaces/repository/reward.repository.interface";
import mongoose, { Types } from "mongoose";
import { IRewardProductPopulated } from "../../types/reward.type";
import { CustomerRewardProgressMapper } from "../../mappers/reward.progress.mapper";
import { IRewardHIstoryRepo } from "../../interfaces/repository/reward.history.repository.interface";
import { INotificationRepository } from "../../interfaces/repository/notification.repository.interface";
import { getIO } from "../../config/socket";
import IProductRepository from "../../interfaces/repository/product.repository.interface";


export class QRService implements IQrService {
    constructor(private _qrRepo: IQrRepository, private _customerProgress: ICustomerRewardProgressRepository, private _rewardRepo: IRewardRepository, private _rewardHistory: IRewardHIstoryRepo, private _notificationRepo: INotificationRepository,private _productRepo:IProductRepository) { }
    generate = async () => {
        try {
            const code = randomUUID();
            const expirySeconds = Number(process.env.QR_EXPIRY_SECONDS) || 90;

            const expiresAt = new Date(
                Date.now() + expirySeconds * 1000
            );

            const createdQr = await this._qrRepo.create({ code, expiresAt })

            const qrImage = await QRCode.toDataURL(code);

            return toQrGenerateResponseDto(createdQr, qrImage)
        } catch (error) {
            console.log("Error in generate Qr code :", error)
            throw error
        }
    }

    verify = async (code: string, customerId: string) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const customerObjectId = new mongoose.Types.ObjectId(customerId);

            const qr = await this._qrRepo.markAsUsedIfValid(code, session);
            if (!qr) {
                throw new AppError(Messages.INVALID_QR, HttpStatus.BAD_REQUEST);
            }

            if (qr.expiresAt && qr.expiresAt < new Date()) {
                throw new AppError(Messages.QR_EXPIRED, HttpStatus.BAD_REQUEST);
            }

            const totalRewards = 3
            const completedCount = await this._customerProgress.countCompleted(customerObjectId, session);

            if (totalRewards > 0 && completedCount >= totalRewards) {
                await session.commitTransaction();
                return {
                    success: true,
                    message: Messages.ALL_REWARDS_COMPLETED,
                    data: {
                        activeReward: null,
                        completedReward: null,
                    },
                };
            }

            let activeProgress = await this._customerProgress.getLatestActiveProgress(
                customerObjectId,
                session
            );

            let completedProgressId: mongoose.Types.ObjectId | null = null;
            let message = Messages.QR_VERIFIED;

            if (!activeProgress) {
                const firstReward = await this._rewardRepo.findByLevel(1, session);

                if (!firstReward) {
                    await session.commitTransaction();
                    return {
                        success: true,
                        message: "No rewards available",
                        data: {
                            activeReward: null,
                            completedReward: null,
                        },
                    };
                }

                activeProgress = await this._customerProgress.createProgress(
                    {
                        customer: customerObjectId,
                        reward: firstReward._id,
                        level: 1,
                        slotCount: firstReward.slotCount,
                        filledSlots: 1,
                        status: "IN_PROGRESS",
                    },
                    session
                );

                message = Messages.REWARD_PROGRESS_STARTED;

            } else {
                if (activeProgress.status !== "IN_PROGRESS") {
                    throw new AppError(Messages.REWARD_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
                }

                const updatedProgress = await this._customerProgress.incrementProgress(
                    activeProgress._id,
                    session
                );

                if (!updatedProgress) {
                    throw new AppError(Messages.REWARD_PROGRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
                }


                await this._rewardHistory.createHistory(
                    {
                        customer: updatedProgress.customer,
                        reward: updatedProgress.reward,
                        level: updatedProgress.level,
                        slotCount: updatedProgress.slotCount,
                        status: "IN_PROGRESS",
                        action: "SLOT_FILLED",
                        redeemedProduct: null,
                        completedAt: null,
                    },
                    session
                );

                activeProgress = updatedProgress;

                if (updatedProgress.filledSlots >= updatedProgress.slotCount) {
                    const reward = await this._rewardRepo.findByLevel(updatedProgress.level, session);

                    if (!reward || !reward.rewardProducts.length) {
                        throw new AppError("No reward products available", HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                    const redeemedProduct = this.pickRandomProduct(reward.rewardProducts);
                    const redeemedProductDetails=await this._productRepo.findById(redeemedProduct.toString())

                    const completedProgress = await this._customerProgress.markAsCompleted(
                        updatedProgress._id,
                        redeemedProduct,
                        session
                    );

                    await this._notificationRepo.create({
                        customer: customerObjectId,
                        product: redeemedProduct._id,
                        reward: completedProgress!._id,
                        message: `Level ${completedProgress!.level} completed successfully. 
                        Waiting for admin verification.`,
                    });

                    const io = getIO();
                    io.to(customerId).emit("new-notification", {
                        message: `Level ${completedProgress!.level} completed successfully.`,
                        level: completedProgress!.level,
                        product: redeemedProductDetails?.productName,
                    });

                    completedProgressId = completedProgress!._id;

                    await this._rewardHistory.createHistory(
                        {
                            customer: completedProgress!.customer,
                            reward: completedProgress!.reward,
                            level: completedProgress!.level,
                            slotCount: completedProgress!.slotCount,
                            status: "COMPLETED",
                            action: "LEVEL_COMPLETED",
                            redeemedProduct: redeemedProduct,
                            completedAt: new Date(),
                        },
                        session
                    );

                    const nextLevel = updatedProgress.level + 1;
                    const nextReward = await this._rewardRepo.findByLevel(nextLevel, session);

                    if (nextReward) {
                        try {
                            await this._customerProgress.createProgress(
                                {
                                    customer: customerObjectId,
                                    reward: nextReward._id,
                                    level: nextLevel,
                                    slotCount: nextReward.slotCount,
                                    filledSlots: 0,
                                    status: "IN_PROGRESS",
                                },
                                session
                            );

                            await this._notificationRepo.create({
                                customer: customerObjectId,
                                message: `Level ${nextLevel} started. Keep shopping to unlock your next reward!`,
                            });
                            io.to(customerId).emit("new-notification", {
                                message: `Level ${nextLevel} started. Keep shopping!`,
                                level: nextLevel,
                            });


                            message = Messages.REWARD_LEVEL_COMPLETED_NEXT_STARTED;
                        } catch (err: any) {
                            if (err.code === 11000) {
                                message = Messages.ALL_REWARDS_COMPLETED;
                            } else {
                                throw err;
                            }
                        }
                    } else {
                        message = Messages.ALL_REWARDS_COMPLETED;
                    }

                } else {
                    message = Messages.REWARD_PROGRESS_UPDATED;
                }
            }

            await session.commitTransaction();

            const latestActive = await this._customerProgress.getLatestActiveProgress(customerObjectId);

            const completedProgress = completedProgressId
                ? await this._customerProgress.findByIdWithProduct(completedProgressId)
                : null;

            return {
                success: true,
                message,
                data: {
                    activeReward: latestActive
                        ? CustomerRewardProgressMapper.toResponseFromDocument(latestActive)
                        : null,
                    completedReward: completedProgress
                        ? CustomerRewardProgressMapper.toResponse(completedProgress)
                        : null,
                },
            };

        } catch (error) {
            await session.abortTransaction();
            console.error("Error in verify QR:", error);
            throw error;
        } finally {
            session.endSession();
        }
    };


    private pickRandomProduct(
        products: Types.ObjectId[] | IRewardProductPopulated[]
    ): Types.ObjectId {
        const index = Math.floor(Math.random() * products.length);
        const product = products[index];
        if (product instanceof Types.ObjectId) {
            return product;
        }
        return product.id;
    }
}

