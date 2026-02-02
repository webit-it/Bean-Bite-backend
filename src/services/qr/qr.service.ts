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
import mongoose from "mongoose";

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
        try {
            const qr = await this._qrRepo.findByCode(code);
            const customerObjectId = new mongoose.Types.ObjectId(customerId);

            if (!qr) {
                throw new AppError(Messages.INVALID_QR, HttpStatus.NOT_FOUND);
            }

            if (qr.isUsed) {
                throw new AppError(Messages.QR_ALREADY_USED, HttpStatus.BAD_REQUEST);
            }

            if (qr.expiresAt && qr.expiresAt < new Date()) {
                throw new AppError(Messages.QR_EXPIRED, HttpStatus.BAD_REQUEST);
            }

            const updatedQr = await this._qrRepo.markAsUsed(code);
            if (!updatedQr) {
                throw new AppError(Messages.INVALID_QR, HttpStatus.NOT_FOUND);
            }

            const activeProgress =
                await this._customerProgress.getLatestActiveProgress(customerId);

            let message = "QR verified successfully";

            if (!activeProgress) {
                const firstReward = await this._rewardRepo.findByLevel(1);
                if (!firstReward) {
                    return {
                        qrVerified: true,
                        message,
                        progress: {
                            current: null,
                            completed: [],
                        },
                    };
                }

                await this._customerProgress.create({
                    customerId: customerObjectId,
                    rewardId: firstReward._id,
                    level: 1,
                    slotCount: firstReward.slotCount,
                    filledSlots: 1,
                    status: "IN_PROGRESS",
                });

                message = "Reward progress started";
            } else {
                const updatedProgress =
                    await this._customerProgress.incrementProgress(
                        customerId,
                        String(activeProgress._id)
                    );

                if (!updatedProgress) {
                    throw new AppError(
                        "Active reward progress not found",
                        HttpStatus.NOT_FOUND
                    );
                }

                if (updatedProgress.filledSlots >= updatedProgress.slotCount) {
                    await this._customerProgress.markAsCompleted(
                        String(updatedProgress._id)
                    );

                    const nextLevel = updatedProgress.level + 1;
                    const nextReward = await this._rewardRepo.findByLevel(nextLevel);

                    if (nextReward) {
                        await this._customerProgress.create({
                            customerId: customerObjectId,
                            rewardId: nextReward._id,
                            level: nextLevel,
                            slotCount: nextReward.slotCount,
                            filledSlots: 0,
                            status: "IN_PROGRESS",
                        });

                        message = "Reward level completed, next level started";
                    } else {
                        message = "Final reward level completed";
                    }
                } else {
                    message = "Reward progress updated";
                }
            }

            const currentProgress =
                await this._customerProgress.getLatestActiveProgress(customerId);

            const completedProgress =
                await this._customerProgress.getCompletedProgress(customerId);

            return {
                qrVerified: true,
                message,
                progress: {
                    current: currentProgress,
                    completed: completedProgress,
                },
            };
        } catch (error) {
            console.log("Error in verify QR code :", error);
            throw error;
        }
    };

}

