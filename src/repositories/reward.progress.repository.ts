import mongoose, { ClientSession } from "mongoose";
import { ICustomerRewardProgressRepository } from "../interfaces/repository/reward.progress.repository.interface";
import { CustomerRewardProgress } from "../models/customer.reward.progress.model";
import { ICustomerRewardProgressDocument, ICustomerRewardProgressPopulated } from "../types/customerRewardProgress.type";
import { BaseRepository } from "./base.reposiory";

export class RewardProgressRepository
    extends BaseRepository<ICustomerRewardProgressDocument>
    implements ICustomerRewardProgressRepository {
    constructor() {
        super(CustomerRewardProgress);
    }
    async getLatestActiveProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {
        return CustomerRewardProgress.findOne({
            customer: customerId,
            status: "IN_PROGRESS",
        })
            .sort({ level: -1, updatedAt: -1 })
            .session(session ?? null)
            .lean();
    }
    async incrementProgress(
        progressId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {
        return CustomerRewardProgress.findByIdAndUpdate(
            progressId,
            { $inc: { filledSlots: 1 } },
            { new: true }
        )
            .session(session ?? null);
    }
    async markAsCompleted(
        progressId: mongoose.Types.ObjectId,
        redeemedProductId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {

        await CustomerRewardProgress.findByIdAndUpdate(
            progressId,
            {
                status: "COMPLETED",
                completedAt: new Date(),
                redeemedProduct: redeemedProductId,
                redeemedAt: new Date(),
            },
            { session }
        );

        const updated = await CustomerRewardProgress.findById(progressId)
            .populate({
                path: "redeemedProduct",
                select: "productName image slug",
            })
            .session(session ?? null);

        return updated;

    }


    async getCompletedProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument[]> {
        return CustomerRewardProgress.find({
            customer: customerId,
            status: "COMPLETED",
        }).populate({
            path: "redeemedProduct",
            select: "productName image slug",
        })
            .sort({ completedAt: -1 })
            .session(session ?? null)
            .lean();
    }
    async createProgress(
        data: Partial<ICustomerRewardProgressDocument>,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument> {
        const [progress] = await CustomerRewardProgress.create(
            [data],
            { session }
        );
        return progress;
    }
    async findByIdWithProduct(
        progressId: mongoose.Types.ObjectId
    ) {
        return CustomerRewardProgress
            .findById(progressId)
            .populate({
                path: "redeemedProduct",
                select: "productName slug image",
            })
            .lean<ICustomerRewardProgressPopulated>()
            .exec();
    }
}   
