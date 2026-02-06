import mongoose, { Schema } from "mongoose";
import { ICustomerRewardProgressDocument } from "../types/customerRewardProgress.type";



const UserRewardProgressSchema = new Schema<ICustomerRewardProgressDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    reward: {
      type: Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },

    level: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },

    slotCount: {
      type: Number,
      required: true,
    },

    filledSlots: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "REDEEMED", "EXPIRED"],
      default: "IN_PROGRESS",
      index: true,
    },

    completedAt: {
      type: Date,
    },
    redeemedProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    redeemedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserRewardProgressSchema.index(
  { customerId: 1, rewardId: 1 },
  { unique: true }
);

export const CustomerRewardProgress = mongoose.model<ICustomerRewardProgressDocument>(
  "UserRewardProgress",
  UserRewardProgressSchema
);
