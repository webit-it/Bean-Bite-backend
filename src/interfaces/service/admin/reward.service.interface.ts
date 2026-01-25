import { RewardResponseDto } from "../../../types/reward.type"

export interface IRewardService{
    getAllRewards():Promise<RewardResponseDto[]> 
    getRewardByLevel(level: number):Promise<RewardResponseDto | null>
    updateLevel(level: number, slotCount: number, rewardName: string):Promise<RewardResponseDto> 
}