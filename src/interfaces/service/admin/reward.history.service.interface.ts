import { RewardHistoryResponseDto } from "../../../types/reward.history.type";

export interface IAdminRewardHistoryService {
    getRewardHistories(search?: string, action?: "LEVEL_COMPLETED" | "SLOT_FILLED", limit?: number, page?: number): Promise<{
        data: RewardHistoryResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number
    }>
    toggleRedeem(historyId:string):Promise<{message:string}>
}