import { Request, Response } from "express";
import HttpStatus from "../../constants/httpsStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { IAdminRewardHistoryService } from "../../interfaces/service/admin/reward.history.service.interface";

export class RewardHistoryController {
    constructor(private _rewardHistoryService: IAdminRewardHistoryService) { }
    getRewardHistories = async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const search = req.query.search as string | undefined;
        const action = req.query.action as "LEVEL_COMPLETED" | "SLOT_FILLED"
        try {
            const rewardsHistories = await this._rewardHistoryService.getRewardHistories(search,action,limit,page);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                ...rewardsHistories
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
    toggleRedeem = async (req: Request, res: Response) => {
         const { historyId } = req.params;
        try {
            const message = await this._rewardHistoryService.toggleRedeem(historyId);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                message
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