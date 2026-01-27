import { IReward, IRewardDocument } from "../../types/reward.type";

export interface IRewardRepository {
  findByLevel(level: number): Promise<IRewardDocument | null>;
  updateSlotCount(level: number, data: Partial<{ rewardName: string; slotCount: number }>): Promise<IRewardDocument | null>;
  findAll(): Promise<IRewardDocument[]>;
  create(data: Partial<IReward>): Promise<IRewardDocument>;
}