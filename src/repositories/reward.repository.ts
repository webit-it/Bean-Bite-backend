import { IRewardRepository } from "../interfaces/repository/reward.repository.interface";
import { Reward } from "../models/reward.model";
import { IRewardDocument } from "../types/reward.type";
import { BaseRepository } from "./base.reposiory";

export class RewardRepository extends BaseRepository<IRewardDocument> implements IRewardRepository {
    constructor() {
        super(Reward);
    }
    async findByLevel(level: number) {
        return Reward.findOne({ level })
            .populate({
                path: "rewardProducts",
                select: "productName image",
            }).exec();
    }
    async updateSlotCount(level: number, data: Partial<{ rewardName: string; slotCount: number }>) {
        return Reward.findOneAndUpdate(
            { level },
            { $set: data },
            { new: true }
        );
    }
    async findAll() {
        return Reward.find().populate("rewardProducts", "productName image");
    }
}