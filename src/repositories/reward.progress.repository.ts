import mongoose, { ClientSession } from "mongoose";
import { ICustomerRewardProgressRepository } from "../interfaces/repository/reward.progress.repository.interface";
import { CustomerRewardProgress } from "../models/customer.reward.progress.model";
import { ICustomerRewardProgressDocument } from "../types/customerRewardProgress.type";
import { BaseRepository } from "./base.reposiory";

export class RewardProgressRepository extends BaseRepository<ICustomerRewardProgressDocument> implements ICustomerRewardProgressRepository {
    constructor() {
        super(CustomerRewardProgress);
    }
    async getLatestActiveProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {
        return await CustomerRewardProgress.findOne(
            {
                customerId,
                status: "IN_PROGRESS",
            },
            null,
            { session }
        )
            .sort({ level: -1, updatedAt: -1 })
            .lean();
    }

    async incrementProgress(
        progressId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {
        return await CustomerRewardProgress.findByIdAndUpdate(
            progressId,
            { $inc: { filledSlots: 1 } },
            { new: true, session }
        );
    }

    async markAsCompleted(
        progressId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {
        return await CustomerRewardProgress.findByIdAndUpdate(
            progressId,
            {
                status: "COMPLETED",
                completedAt: new Date(),
            },
            { new: true, session }
        );
    }

    async getCompletedProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument[]> {
        return await CustomerRewardProgress.find(
            {
                customerId,
                status: "COMPLETED",
            },
            null,
            { session }
        )
            .sort({ completedAt: -1 })
            .lean();
    }

    async createProgress(
        data: Partial<ICustomerRewardProgressDocument>,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument> {
        const [progress] = await CustomerRewardProgress.create([data], { session });
        return progress;
    }
}