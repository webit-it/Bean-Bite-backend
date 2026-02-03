import { Types } from "mongoose";
import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import { IRewardRepository } from "../../interfaces/repository/reward.repository.interface";
import { IRewardService } from "../../interfaces/service/admin/reward.service.interface";
import { toRewardResponseDto, toRewardResponseDtoArray } from "../../mappers/reward.mapper";
import { IReward, RewardResponseDto } from "../../types/reward.type";
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
    updateRewardByLevel = async (level: number, slotCount?: number, rewardName?: string, rewardProducts?: string[]): Promise<RewardResponseDto> => {
        try {
            if (![1, 2, 3].includes(level)) {
                throw new AppError(
                    Messages.INVALID_REWARD_LEVEL,
                    HttpStatus.BAD_REQUEST
                );
            }

            if (slotCount !== undefined && (slotCount < 4 || slotCount > 6)) {
                throw new AppError(
                    Messages.INVALID_SLOT_COUNT,
                    HttpStatus.BAD_REQUEST
                );
            }

            if (rewardName !== undefined && rewardName.trim() === "") {
                throw new AppError(
                    Messages.REWARD_CANNOT_BE_EMPTY,
                    HttpStatus.BAD_REQUEST
                );
            }

            const updateData:Partial<IReward>= {};

            if (slotCount !== undefined) updateData.slotCount = slotCount;
            if (rewardName !== undefined) updateData.rewardName = rewardName;

            if (rewardProducts) {
                updateData.rewardProducts = rewardProducts.map(
                    (id) => new Types.ObjectId(id)
                );
            }
            const updatedReward = await this._rewardRepo.updateRewardByLevel(level, updateData);
            if (!updatedReward) {
                throw new AppError(
                    Messages.INVALID_REWARD_LEVEL,
                    HttpStatus.NOT_FOUND
                );
            }
            await updatedReward.populate('rewardProducts');
            return toRewardResponseDto(updatedReward);
        } catch (error) {
            console.error("Error in updateSlotCount:", error);
            throw error
        }
    };
    addReward = async ( rewardName: string,slug: string,level: number, slotCount: number, rewardProductIds: string[]): Promise<RewardResponseDto> => {
        try {
            if (!rewardName || !slug || !level || !slotCount) {
                throw new AppError(
                    Messages.MISSING_FIELDS,
                    HttpStatus.NOT_FOUND
                );
            }

            const data = {
                slotCount,
                rewardName,
                slug,
                level,
                rewardProductIds: rewardProductIds.map(
                    (id: string) => new Types.ObjectId(id)
                ),
            }
            const createdReward = await this._rewardRepo.create(data);
            if (!createdReward) {
                throw new AppError(
                    Messages.INVALID_REWARD_LEVEL,
                    HttpStatus.NOT_FOUND
                );
            }
            return toRewardResponseDto(createdReward);
        } catch (error) {
            console.error("Error in create reward:", error);
            throw error
        }
    };
}