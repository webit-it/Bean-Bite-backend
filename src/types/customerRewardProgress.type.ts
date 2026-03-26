import mongoose, { HydratedDocument, Types } from "mongoose";
export interface ICustomerRewardProgress {
  customer: Types.ObjectId;
  reward: Types.ObjectId;
  redeemedProduct?: Types.ObjectId;
  level: number;
  slotCount: number;
  filledSlots: number;
  status: RewardProgressStatus;
  completedAt: Date;
  createdAt: Date;
  redeemedAt: Date;
  updatedAt: Date;
}



export interface CustomerRewardProgressResponseDto {
  customer: string;
  reward: {
    id: string;
    rewardName: string;
  };
  redeemedProduct: RedeemedProductDto | null;
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

export interface ICustomerRewardProgressPopulated
  extends Omit<ICustomerRewardProgress, "reward" | "redeemedProduct"> {

  reward: {
    _id: mongoose.Types.ObjectId;
    rewardName: string;
  };

  redeemedProduct?: {
    _id: mongoose.Types.ObjectId;
    productName: string;
    slug: string;
    image: string;
  };
}

export interface RedeemedProductDto {
  id: string;
  productName: string;
  slug: string;
  image: string;
}


export interface VerifyQrProgressDto {
  updated: CustomerRewardProgressResponseDto | null;
  completed: CustomerRewardProgressResponseDto | null;
  next: CustomerRewardProgressResponseDto | null;
}