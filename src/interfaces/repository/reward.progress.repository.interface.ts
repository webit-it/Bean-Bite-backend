import mongoose, { ClientSession } from "mongoose"
import { ICustomerRewardProgress, ICustomerRewardProgressDocument } from "../../types/customerRewardProgress.type"

export interface ICustomerRewardProgressRepository {
    create(data: Partial<ICustomerRewardProgress>): Promise<ICustomerRewardProgressDocument>
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
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument | null>
    getCompletedProgress(
        customerId: mongoose.Types.ObjectId,
        session?: ClientSession
    ): Promise<ICustomerRewardProgressDocument[]>
}