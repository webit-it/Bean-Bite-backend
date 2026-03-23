import { Types } from "mongoose";
import { IReward, IRewardDocument } from "../../types/reward.type";
import { ClientSession } from "mongoose";

export interface IRewardRepository {
  findByLevel(level: number, session?: ClientSession): Promise<IRewardDocument | null>;
  findBySlug(slug: string): Promise<IReward | null>;
  findByName(name: string): Promise<IReward | null>
  updateRewardByLevel(level: number, data: Partial<IReward>,rewardProducts?: string[]): Promise<IRewardDocument | null>;
  findAll(): Promise<IRewardDocument[]>;
  create(data: Partial<IReward>): Promise<IRewardDocument>;
}