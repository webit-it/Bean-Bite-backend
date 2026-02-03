import { Types } from "mongoose";
import { IReward, IRewardDocument } from "../../types/reward.type";

export interface IRewardRepository {
  findByLevel(level: number): Promise<IRewardDocument | null>;
  updateRewardByLevel(level: number, data: Partial<IReward>): Promise<IRewardDocument | null>;
  findAll(): Promise<IRewardDocument[]>;
  create(data: Partial<IReward>): Promise<IRewardDocument>;
}