import { HydratedDocument, Types } from "mongoose";

export interface ICustomerRewardProgress {
  customerId: Types.ObjectId;
  rewardId:  Types.ObjectId;
  level: number;
  slotCount: number;
  filledSlots: number;
  status: RewardProgressStatus;
  completedAt: Date;
  createdAt: Date;
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
  customerId: Types.ObjectId;
  rewardId:  Types.ObjectId;
  level: number;
  slotCount: number;
  FilledSlots: number;
  status: RewardProgressStatus;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}