import { HydratedDocument, Types } from "mongoose";

export interface ICustomerRewardProgress {
  customer: Types.ObjectId;
  reward:  Types.ObjectId;
  redeemedProduct:  Types.ObjectId| RedeemedProductDto;
  level: number;
  slotCount: number;
  filledSlots: number;
  status: RewardProgressStatus;
  completedAt: Date;
  createdAt: Date;
  redeemedAt: Date;
  updatedAt: Date;
}


type RewardProgressStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REDEEMED"
  | "EXPIRED";

export type ICustomerRewardProgressDocument = HydratedDocument<ICustomerRewardProgress>;


export interface CustomerRewardProgressResponseDto {
  customer: Types.ObjectId;
  reward:  Types.ObjectId;
  radeemedProduct:  Types.ObjectId| RedeemedProductDto;
  level: number;
  slotCount: number;
  FilledSlots: number;
  status: RewardProgressStatus;
  completedAt: Date;
  createdAt: Date;
  redeemedAt: Date;
  updatedAt: Date;
}


export interface RedeemedProductDto {
  id: Types.ObjectId;
  name: string;
  slug: string;
  image: string;
}