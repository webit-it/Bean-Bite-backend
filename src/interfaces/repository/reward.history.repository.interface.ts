import { ClientSession } from "mongoose";
import { IRewardHistory, IRewardHistoryDocument } from "../../types/reward.history.type";
import { UpdateQuery } from "mongoose";

export interface IRewardHIstoryRepo {
    createHistory(data: Partial<IRewardHistory>, session?: ClientSession): Promise<IRewardHistoryDocument>
    findByIdWithSession(id: string, session?: ClientSession): Promise<IRewardHistoryDocument | null>
    updateStatus(id: string, update: UpdateQuery<IRewardHistory>, session?: ClientSession): Promise<IRewardHistoryDocument | null>;
    findAllWithDetails(
        search?: string,
        action?: "SLOT_FILLED" | "LEVEL_COMPLETED",
        skip?: number,
        limit?: number
    ): Promise<{data:IRewardHistoryDocument,totalCount:number}>;
}