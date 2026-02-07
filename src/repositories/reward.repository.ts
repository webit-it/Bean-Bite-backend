import { ClientSession, Types } from "mongoose";
import { IRewardRepository } from "../interfaces/repository/reward.repository.interface";
import { Reward } from "../models/reward.model";
import { IReward, IRewardDocument } from "../types/reward.type";
import { BaseRepository } from "./base.reposiory";

export class RewardRepository extends BaseRepository<IRewardDocument> implements IRewardRepository {
    constructor() {
        super(Reward);
    }
    async findByLevel(level: number,session?: ClientSession) {
        return Reward.findOne({ level }).select("rewardProducts level").session(session ?? null);
    }
    async findByName(name: string): Promise<IReward | null> {
        return Reward.findOne({ rewardName: name });
    }

    async findBySlug(slug: string): Promise<IReward | null> {
        return Reward.findOne({ slug });
    }
    async updateRewardByLevel(
        level: number,
        data: Partial<IReward>,
        rewardProductIds?: string[]
    ) {
        const updateQuery: Partial<IReward> & { $addToSet?: { rewardProducts: { $each: Types.ObjectId[] } } } = { ...data };

        if (rewardProductIds && rewardProductIds.length > 0) {
            updateQuery.$addToSet = { rewardProducts: { $each: rewardProductIds.map(id => new Types.ObjectId(id)) } };
        }

        return Reward.findOneAndUpdate({ level }, updateQuery, { new: true });
    }
    async findAll() {
        return Reward.find().populate("rewardProducts", "productName image");
    }
}