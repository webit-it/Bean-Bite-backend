import mongoose, { Schema, Types } from "mongoose";
import { IRewardHistoryDocument } from "../types/reward.history.type";

const RewardHistorySchema = new Schema<IRewardHistoryDocument>(
  {
    customer: {
      type: Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    reward: {
      type: Types.ObjectId,
      ref: "Reward",
      required: true,
    },

    level: {
      type: Number,
      required: true,
    },

    slotCount: {
      type: Number,
      required: true,
    },

    redeemedProduct: {
      type: Types.ObjectId,
      ref: "Product",
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "REDEEMED"],
      required: true,
    },
    action: {
      type: String,
      enum: ["SLOT_FILLED", "LEVEL_COMPLETED"]
    },

    completedAt: Date,
    redeemedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const RewardHistory = mongoose.model<IRewardHistoryDocument>(
  "RewardHistory",
  RewardHistorySchema
);
