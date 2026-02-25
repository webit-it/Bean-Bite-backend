import mongoose, { ClientSession } from "mongoose"
import { ICustomerRewardProgressDocument, ICustomerRewardProgressPopulated } from "../../types/customerRewardProgress.type"

export interface ICustomerRewardProgressRepository {
    createProgress(
        data: Partial<ICustomerRewardProgressDocument>,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument>
    getLatestActiveProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null>
    incrementProgress(
        progressId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null>
    markAsCompleted(
        progressId: mongoose.Types.ObjectId,
        redeemedProductId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null>
    getCompletedProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressPopulated[]>
    findByIdWithProduct(
        progressId: mongoose.Types.ObjectId
    ): Promise<ICustomerRewardProgressPopulated | null>;
    countCompleted(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<number>
    updateProgressStatus(
        data: {
            customer: mongoose.Types.ObjectId;
            reward: mongoose.Types.ObjectId;
            level: number;
            status: string;
            redeemedAt?: Date;
        },
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null>
}