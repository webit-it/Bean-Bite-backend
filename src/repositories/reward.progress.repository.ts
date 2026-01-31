import mongoose from "mongoose";
import { ICustomerRewardProgressRepository } from "../interfaces/repository/reward.progress.repository.interface";
import { CustomerRewardProgress } from "../models/customer.reward.progress.model";
import { ICustomerRewardProgressDocument } from "../types/customerRewardProgress.type";
import { BaseRepository } from "./base.reposiory";

export class RewardProgressRepository extends BaseRepository<ICustomerRewardProgressDocument> implements ICustomerRewardProgressRepository {
    constructor() {
        super(CustomerRewardProgress);
    }
    async getLatestActiveProgress(
        customerId: string
    ) {
        const result = await CustomerRewardProgress.aggregate([
            {
                $match: {
                    customerId: new mongoose.Types.ObjectId(customerId),
                    status: "IN_PROGRESS",
                },
            },
            { $sort: { level: -1, updatedAt: -1 } },
            { $limit: 1 },
        ]);

        return result.length > 0 ? (result[0] as ICustomerRewardProgressDocument) : null;
    }

    // async getAllCustomerRewardProgress(
    //     customerId: string
    // ) {
    //     return await CustomerRewardProgress.find({ customerId })
    // }
    async incrementProgress(
        customerId: string,
        rewardId: string,
    ) {
        return await CustomerRewardProgress.findOneAndUpdate({ customerId, rewardId }, { $inc: { filledSlots: 1 } }, { new: true })
    }
}