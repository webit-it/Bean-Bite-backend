import { IRewardRepository } from "../interfaces/repository/reward.repository.interface";
import { Reward } from "../models/reward.model";
import { IRewardDocument } from "../types/reward.type";
import { BaseRepository } from "./base.reposiory";

export class RewardRepository extends BaseRepository<IRewardDocument> implements IRewardRepository {
    constructor() {
        super(Reward);
    }
    async findByLevel(level: number) {
        return Reward.findOne({ level });
    }
    async updateSlotCount(level: number, slotCount: number) {
        return Reward.findOneAndUpdate(
            { level },
            { $set: { slotCount } },
            { new: true }
        );
    }
}