import { HydratedDocument, ObjectId } from "mongoose";

export interface IReward {
  rewardName: string;
  slug: string;
  level: number;
  slotCount: number;
  rewardProductIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type IRewardDocument = HydratedDocument<IReward>;


export interface RewardResponseDto {
  rewardName: string;
  slug: string;
  level: number;
  slotCount: number;
  rewardProductIds: string[];
  createdAt: Date;
  updatedAt: Date;
}