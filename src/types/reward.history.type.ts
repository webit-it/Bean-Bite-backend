import { Types, HydratedDocument } from "mongoose";

export interface IRewardHistory {
  customer: Types.ObjectId;
  reward: Types.ObjectId;
  level: number;
  slotCount: number;
  status: "COMPLETED" | "REDEEMED"|"IN_PROGRESS";
  action: "SLOT_FILLED"| "LEVEL_COMPLETED";
  redeemedProduct?: Types.ObjectId|null;
  redeemedByAdmin?: Types.ObjectId;
  completedAt?: Date|null;
  redeemedAt?: Date
  createdAt: Date;
  updatedAt: Date;
}

export type IRewardHistoryDocument = HydratedDocument<IRewardHistory>;