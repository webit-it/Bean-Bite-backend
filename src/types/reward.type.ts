import { HydratedDocument, ObjectId, Types } from "mongoose";

export interface IReward {
  rewardName: string;
  slug: string;
  level: number;
  slotCount: number;
  rewardProducts: Types.ObjectId[]| IRewardProductPopulated[];
  createdAt: Date;
  updatedAt: Date;
}

export type IRewardDocument = HydratedDocument<IReward>;


export interface RewardProductDto {
  id: string;
  productName: string;
  image: string;
}

export interface RewardResponseDto {
  id: Types.ObjectId;
  rewardName: string;
  slug: string;
  level: number;
  slotCount: number;
  rewardProducts: RewardProductDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRewardProductPopulated {
  id: Types.ObjectId;
  productName: string;
  image: string;
}