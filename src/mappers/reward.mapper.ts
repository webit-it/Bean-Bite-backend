import { IRewardDocument, RewardResponseDto } from "../types/reward.type";

  export const toRewardResponseDto = (reward: IRewardDocument): RewardResponseDto => {
    return {
      rewardName: reward.rewardName,
      slug: reward.slug,
      level: reward.level,
      slotCount: reward.slotCount,
      rewardProductIds: reward.rewardProductIds.map(id => id.toString()),
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt
    };
  };

export const toRewardResponseDtoArray = (rewards: IRewardDocument[]): RewardResponseDto[] => {
  return rewards.map(toRewardResponseDto);
};
