import mongoose from "mongoose";
import { IRewardHIstoryRepo } from "../../interfaces/repository/reward.history.repository.interface"
import { ICustomerRewardProgressRepository } from "../../interfaces/repository/reward.progress.repository.interface"
import { IAdminRewardHistoryService } from "../../interfaces/service/admin/reward.history.service.interface";
import { RewardHistoryMapper } from "../../mappers/reward.history.mapper";

export class AdminRewardHistoryService implements IAdminRewardHistoryService {
    constructor(private _rewardHistoryRepo: IRewardHIstoryRepo, private _customerProgressRepo: ICustomerRewardProgressRepository) { }
    getRewardHistories = async (search: string, action: "LEVEL_COMPLETED" | "SLOT_FILLED", limit: number, page: number) => {
        try {
            const skip = (page - 1) * limit;
            const { data, totalCount } = await this._rewardHistoryRepo.findAllWithDetails(search, action, skip, limit)
            return {
                data: RewardHistoryMapper.toResponseList(data),
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            console.log("Error in get reward history in admin ", error);
            throw error
        }
    }
    toggleRedeem = async (
        historyId: string,
    ) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const history =
                await this._rewardHistoryRepo.findByIdWithSession(historyId, session);

            if (!history) {
                throw new Error("History not found");
            }

            let newStatus: "COMPLETED" | "REDEEMED";

            if (history.status === "COMPLETED") {
                newStatus = "REDEEMED";
            } else {
                newStatus = "COMPLETED";
            }
            await this._rewardHistoryRepo.updateStatus(
                historyId,
                {
                    status: newStatus,
                    redeemedAt:
                        newStatus === "REDEEMED" ? new Date() : undefined,
                },
                session
            );
            // await this._customerProgressRepo.updateProgressStatus(
            //     {
            //         customer: history.customer,
            //         reward: history.reward,
            //         level: history.level,
            //     },
            //     {
            //         status: newStatus,
            //         redeemedByAdmin:
            //             newStatus === "REDEEMED" ? adminId : undefined,
            //         redeemedAt:
            //             newStatus === "REDEEMED" ? new Date() : undefined,
            //     },
            //     session
            // );
            //     await this._customerProgressRepo.updateProgressStatus(
            //     {
            //         customer: history.customer,
            //         reward: history.reward,
            //         level: history.level,
            //     },
            //     {
            //         status: newStatus,
            //         redeemedAt:
            //             newStatus === "REDEEMED" ? new Date() : undefined,
            //     },
            //     session
            // );

            await session.commitTransaction();

            return {
                message: "Redeem status updated successfully",
            };
        } catch (error) {
            await session.abortTransaction();
            console.log("Error in toggler redeem :",error)
            throw error;
        }
    };
}