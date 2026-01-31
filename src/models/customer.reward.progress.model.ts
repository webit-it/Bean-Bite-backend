import mongoose, { Schema } from "mongoose";
import { ICustomerRewardProgressDocument } from "../types/customerRewardProgress.type";



const UserRewardProgressSchema = new Schema<ICustomerRewardProgressDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    rewardId: {
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
  },
  {
    timestamps: true,
  }
);

UserRewardProgressSchema.index(
  { userId: 1, rewardId: 1 },
  { unique: true }
);

export const CustomerRewardProgress = mongoose.model<ICustomerRewardProgressDocument>(
  "UserRewardProgress",
  UserRewardProgressSchema
);
