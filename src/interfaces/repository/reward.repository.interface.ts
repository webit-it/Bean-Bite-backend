import { IRewardDocument } from "../../types/reward.type";

export interface IRewardRepository {
  findByLevel(level: number): Promise<IRewardDocument | null>;
  updateSlotCount(level: number, slotCount: number): Promise<IRewardDocument | null>;
  findAll(): Promise<IRewardDocument[]>;
}