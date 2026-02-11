import { HydratedDocument, Types } from "mongoose";
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
  reward: string;
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


export type ICustomerRewardProgressPopulated =
  Omit<ICustomerRewardProgress, "redeemedProduct"> & {
    redeemedProduct?: RedeemedProductDto & { _id: Types.ObjectId };
  };


export interface RedeemedProductDto {
  id: string;
  productName: string;
  slug: string;
  image: string;
}