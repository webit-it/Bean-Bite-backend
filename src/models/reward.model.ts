import mongoose, { Schema } from "mongoose";
import { IRewardDocument } from "../types/reward.type";

const RewardSchema = new Schema<IRewardDocument>(
    {
        rewardName: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        level: {
            type: Number,
            enum: [1, 2, 3],
            required: true,
            unique: true,
        },
        slotCount: {
            type: Number,
            required: true,
            min: 4,
            max: 6,
        },
        rewardProductIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Reward = mongoose.model<IRewardDocument>(
    "Reward",
    RewardSchema
);