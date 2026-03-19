import { PaginatedHistory, PaginatedRewardHistoryResponse } from "../../../types/reward.history.type";


export default interface IDashboardServiceInterface {

    getDashboardCounts(): Promise<{
        users: number;
        products: number;
        rewards: number;
    }>;
    getRecentReward(
        page: number,
        limit: number,
        search?: string,
        status?:boolean
      ): Promise<PaginatedRewardHistoryResponse>;
    
}
