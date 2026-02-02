import { ICustomerRewardProgress, ICustomerRewardProgressDocument } from "../../types/customerRewardProgress.type"

export interface ICustomerRewardProgressRepository {
    create(data: Partial<ICustomerRewardProgress>): Promise<ICustomerRewardProgressDocument>
    getLatestActiveProgress(customerId: string): Promise<ICustomerRewardProgressDocument | null>
    incrementProgress(customerId: string, rewardId: string): Promise<ICustomerRewardProgressDocument | null>
    markAsCompleted(progressId: string): Promise<ICustomerRewardProgressDocument | null>;
    getCompletedProgress(customerId: string): Promise<ICustomerRewardProgressDocument[]>;
}