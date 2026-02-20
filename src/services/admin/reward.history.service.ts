import mongoose from "mongoose"
import { IRewardHIstoryRepo } from "../../interfaces/repository/reward.history.repository.interface"
import { ICustomerRewardProgressRepository } from "../../interfaces/repository/reward.progress.repository.interface"

export class AdminRewardHistoryService {
    constructor(private _rewardHistoryRepo: IRewardHIstoryRepo,private _customerProgressRepo:ICustomerRewardProgressRepository) { }
    // getRewardHistories = async () => {
    //     try {
    //         const histories = await this._rewardHistoryRepo.findAll()
    //         return histories
    //     } catch (error) {
    //         console.log("Error in ger rewrd history in admin ", error)
    //         throw error
    //     }
    // }
    // toggleRedeem = async (
    //     historyId: string,
    //     adminId: string
    // ) => {
    //     const session = await mongoose.startSession();
    //     session.startTransaction();

    //     try {
    //         const history =
    //             await this._rewardHistoryRepo.findById(historyId, session);

    //         if (!history) {
    //             throw new Error("History not found");
    //         }

    //         if (history.status === "EXPIRED") {
    //             throw new Error("Cannot modify expired reward");
    //         }

    //         let newStatus: "COMPLETED" | "REDEEMED";

    //         if (history.status === "COMPLETED") {
    //             newStatus = "REDEEMED";
    //         } else {
    //             newStatus = "COMPLETED";
    //         }
    //         await this._rewardHistoryRepo.updateStatus(
    //             historyId,
    //             {
    //                 status: newStatus,
    //                 redeemedByAdmin:
    //                     newStatus === "REDEEMED" ? adminId : undefined,
    //                 redeemedAt:
    //                     newStatus === "REDEEMED" ? new Date() : undefined,
    //             },
    //             session
    //         );
    //         // await this._customerProgressRepo.updateProgressStatus(
    //         //     {
    //         //         customer: history.customer,
    //         //         reward: history.reward,
    //         //         level: history.level,
    //         //     },
    //         //     {
    //         //         status: newStatus,
    //         //         redeemedByAdmin:
    //         //             newStatus === "REDEEMED" ? adminId : undefined,
    //         //         redeemedAt:
    //         //             newStatus === "REDEEMED" ? new Date() : undefined,
    //         //     },
    //         //     session
    //         // );

    //         await session.commitTransaction();

    //         return {
    //             success: true,
    //             message: "Redeem status updated successfully",
    //         };
    //     } catch (error) {
    //         await session.abortTransaction();
    //         throw error;
    //     }
    // };
}