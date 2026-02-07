import { Types } from "mongoose";
import { IRewardDocument, RewardProductDto, RewardResponseDto } from "../types/reward.type";

interface IProductPopulated {
  id: Types.ObjectId;
  productName: string;
  image: string;
}

<<<<<<< HEAD
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
=======
export const toRewardResponseDto = (reward: IRewardDocument): RewardResponseDto => {
  const rewardProducts: RewardProductDto[] = reward.rewardProducts
    .filter(
      (product): product is IProductPopulated =>
        !(product instanceof Types.ObjectId)
    )
    .map((product) => ({
      id: product.id.toString(),
      productName: product.productName,
      image: product.image,
    }));
  return {
    id:reward._id,
    rewardName: reward.rewardName,
    slug: reward.slug,
    level: reward.level,
    slotCount: reward.slotCount,
    rewardProducts,
    createdAt: reward.createdAt,
    updatedAt: reward.updatedAt,
>>>>>>> feature/reward-management
  };

export const toRewardResponseDtoArray = (
  rewards: IRewardDocument[]
): RewardResponseDto[] => {
  return rewards.map(toRewardResponseDto);
};
