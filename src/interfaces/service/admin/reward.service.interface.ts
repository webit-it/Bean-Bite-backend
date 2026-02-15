import { RewardResponseDto } from "../../../types/reward.type"

export interface IRewardService {
    getAllRewards(): Promise<RewardResponseDto[]>
    getRewardByLevel(level: number): Promise<RewardResponseDto | null>
    updateRewardByLevel(level: number, slotCount?: number, rewardName?: string, rewardProductIds?: string[],slug?:string): Promise<RewardResponseDto>
    addReward(rewardName: string,slug: string,level: number, slotCount: number, rewardProductIds: string[]): Promise<RewardResponseDto>
}