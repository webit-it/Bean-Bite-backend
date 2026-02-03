import { Request, Response } from "express";
import { IRewardService } from "../../interfaces/service/admin/reward.service.interface";
import HttpStatus from "../../constants/httpsStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class RewardController {
    constructor(private _rewardService: IRewardService) { }
    getRewards = async (req: Request, res: Response) => {
        try {
            const rewards = await this._rewardService.getAllRewards();
            return res.status(HttpStatus.CREATED).json({
                success: true,
                rewards
            });
        } catch (error: unknown) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    }

    getRewardByLevel = async (req: Request, res: Response) => {
        try {
            const level = Number(req.params.level);
            const reward = await this._rewardService.getRewardByLevel(level);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                reward
            });
        } catch (error: unknown) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    }

    updateRewardByLevel = async (req: Request, res: Response) => {
        try {
            const level = Number(req.params.level);
            const { slotCount, rewardName, rewardProducts } = req.body;

            const reward = await this._rewardService.updateRewardByLevel(level, slotCount, rewardName,rewardProducts);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                reward
            });
        } catch (error: unknown) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    }
    addReward = async (req: Request, res: Response) => {
        try {
            const {
                rewardName,
                slug,
                level,
                slotCount,
                rewardProductIds = [],
            } = req.body;

            const reward = await this._rewardService.addReward(rewardName,slug,level,slotCount,rewardProductIds);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                reward
            });
        } catch (error: unknown) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    }
}