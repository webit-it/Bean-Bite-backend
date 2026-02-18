import { Types, HydratedDocument } from "mongoose";

export interface IRewardHistory {
  customer: Types.ObjectId;
  reward: Types.ObjectId;
  level: number;
  slotCount: number;
  status: "COMPLETED" | "REDEEMED" | "EXPIRED";
  redeemedProduct?: Types.ObjectId;
  redeemedByAdmin?: Types.ObjectId;
  completedAt?: Date;
  redeemedAt?: Date
  createdAt: Date;
  updatedAt: Date;
}

export type IRewardHistoryDocument = HydratedDocument<IRewardHistory>;