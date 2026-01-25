import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import { IRewardRepository } from "../../interfaces/repository/reward.repository.interface";
import { IRewardService } from "../../interfaces/service/admin/reward.service.interface";
import { toRewardResponseDto, toRewardResponseDtoArray } from "../../mappers/reward.mapper";
import { RewardResponseDto } from "../../types/reward.type";
import AppError from "../../utils/AppError";

export class RewardService implements IRewardService {
    constructor(private _rewardRepo: IRewardRepository) { }
    getAllRewards = async () => {
        try {
            const rewards = await this._rewardRepo.findAll()
            return toRewardResponseDtoArray(rewards);
        } catch (error) {
            console.error("Error in get rewards", error)
            throw error
        }
    }
    getRewardByLevel = async (level: number): Promise<RewardResponseDto | null> => {
        try {
            if (![1, 2, 3].includes(level)) {
                throw new AppError(
                    Messages.INVALID_REWARD_LEVEL,
                    HttpStatus.NOT_FOUND
                );
            }

            const reward = await this._rewardRepo.findByLevel(level);
            if (!reward) return null;

            return toRewardResponseDto(reward);
        } catch (error) {
            console.error("Error in getRewardByLevel:", error);
            throw error
        }
    };
    updateLevel = async (level: number, slotCount: number, rewardName: string): Promise<RewardResponseDto> => {
        try {
            if (![1, 2, 3].includes(level)) {
                throw new AppError(
                    Messages.INVALID_REWARD_LEVEL,
                    HttpStatus.NOT_FOUND
                );
            }
            if (slotCount < 4 || slotCount > 6) {
                throw new AppError(
                    Messages.INVALID_SLOT_COUNT,
                    HttpStatus.NOT_FOUND
                );
            }

            if (rewardName !== undefined &&rewardName.trim() === "") {
                 throw new AppError(
                    Messages.REWARD_CANNOT_BE_EMPTY,
                    HttpStatus.NOT_FOUND
                );
            }

            const data={
                slotCount,
                rewardName
            }
            const updatedReward = await this._rewardRepo.updateSlotCount(level, data);
            if (!updatedReward) {
                throw new AppError(
                    Messages.INVALID_REWARD_LEVEL,
                    HttpStatus.NOT_FOUND
                );
            }
            return toRewardResponseDto(updatedReward);
        } catch (error) {
            console.error("Error in updateSlotCount:", error);
            throw error
        }
    };
}