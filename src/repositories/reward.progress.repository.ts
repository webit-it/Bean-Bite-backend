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

        const query = CustomerRewardProgress.findByIdAndUpdate(
            progressId,
            {
                status: "COMPLETED",
                completedAt: new Date(),
                redeemedProduct: redeemedProductId,
                redeemedAt: new Date(),
            },
            { new: true }
        ).populate({
            path: "redeemedProduct",
            select: "productName image slug",
        });

        if (session) {
            query.session(session);
        }
        return query.exec();
    }


    async getCompletedProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressPopulated[]> {
        return CustomerRewardProgress.find({
            customer: customerId,
            status: "COMPLETED",
        }).populate({
            path: "redeemedProduct",
            select: "productName image slug",
        })
            .sort({ completedAt: -1 })
            .session(session ?? null)
            .lean<ICustomerRewardProgressPopulated[]>()
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
    async countCompleted(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<number> {
        return await CustomerRewardProgress.countDocuments({
            customer: customerId,
            status: "COMPLETED",
        }).session(session ?? null);
    };
    async updateProgressStatus(
        data: {
            customer: mongoose.Types.ObjectId;
            reward: mongoose.Types.ObjectId;
            level: number;
            status: string;
            redeemedAt?: Date;
        },
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null> {
        const { customer, reward, level, status, redeemedAt } = data;

        return CustomerRewardProgress.findOneAndUpdate(
            { customer, reward, level },
            {
                status,
                ...(redeemedAt && { redeemedAt }),
            },
            { new: true }
        )
            .session(session ?? null)
            .exec();
    }
}   
