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
import { ICustomerRewardProgressDocument } from "../../types/customerRewardProgress.type";

export class QRService implements IQrService {
    constructor(private _qrRepo: IQrRepository, private _customerProgress: ICustomerRewardProgressRepository, private _rewardRepo: IRewardRepository) { }
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

            const activeProgress =
                await this._customerProgress.getLatestActiveProgress(
                    customerObjectId,
                    session
                );
            let message = Messages.QR_VERIFIED;

            let responseProgress: ICustomerRewardProgressDocument | null = null;
            if (!activeProgress) {
                const firstReward = await this._rewardRepo.findByLevel(1, session);

                if (!firstReward) {
                    await session.commitTransaction();
                    return {
                        qrVerified: true,
                        message,
                        progress: null,
                    };
                }

                const newProgress =await this._customerProgress.createProgress(
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

                responseProgress = newProgress;
                message = Messages.REWARD_PROGRESS_STARTED;
            } else {
                if (activeProgress.status !== "IN_PROGRESS") {
                    throw new AppError(
                        Messages.REWARD_NOT_ACTIVE,
                        HttpStatus.BAD_REQUEST
                    );
                }

                const updatedProgress =
                    await this._customerProgress.incrementProgress(
                        activeProgress._id,
                        session
                    );

                if (!updatedProgress) {
                    throw new AppError(
                        Messages.REWARD_PROGRESS_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                    );
                }

                if (updatedProgress.filledSlots >= updatedProgress.slotCount) {
                    const reward = await this._rewardRepo.findByLevel(
                        updatedProgress.level,
                        session
                    );

                    if (!reward || !reward.rewardProducts.length) {
                        throw new AppError(
                            "No reward products available",
                            HttpStatus.INTERNAL_SERVER_ERROR
                        );
                    }
                    const redeemedProduct = this.pickRandomProduct(reward.rewardProducts);

                    const completedProgress =
                        await this._customerProgress.markAsCompleted(
                            updatedProgress._id,
                            redeemedProduct,
                            session
                        );

                    responseProgress = completedProgress;

                    const nextLevel = updatedProgress.level + 1;
                    const nextReward =
                        await this._rewardRepo.findByLevel(nextLevel, session);

                    if (nextReward) {
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

                        message = Messages.REWARD_LEVEL_COMPLETED_NEXT_STARTED;
                    } else {
                        message = Messages.ALL_REWARDS_COMPLETED;
                    }
                } else {
                    responseProgress = updatedProgress;
                    message = Messages.REWARD_PROGRESS_UPDATED;
                }
            }

            const currentProgress =
                await this._customerProgress.getLatestActiveProgress(
                    customerObjectId,
                    session
                );


            await session.commitTransaction();

            return {
                qrVerified: true,
                message,
                progress: responseProgress,
            };

        } catch (error) {
            await session.abortTransaction();
            console.error("Error in verify QR code:", error);
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

