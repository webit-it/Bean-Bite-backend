import { ClientSession, UpdateQuery } from "mongoose";
import { RewardHistory } from "../models/history.model";
import { IRewardHistory, IRewardHistoryDocument } from "../types/reward.history.type";
import { BaseRepository } from "./base.reposiory";
import { IRewardHIstoryRepo } from "../interfaces/repository/reward.history.repository.interface";

export class RewardHistoryRepository extends BaseRepository<IRewardHistoryDocument> implements IRewardHIstoryRepo {
    constructor() {
        super(RewardHistory)
    }
    createHistory = async (
        payload: Partial<IRewardHistory>,
        session?: ClientSession
    ) => {
        const [doc] = await this.model.create(
            [payload],
            session ? { session } : {}
        );

        return doc;
    };
    findById = async (
        id: string,
        session?: ClientSession
    ) => {
        return this.model.findById(id).session(session ?? null);
    };
    updateStatus = async (
        id: string,
        update: UpdateQuery<IRewardHistory>,
        session?: ClientSession
    ) => {
        return this.model.findByIdAndUpdate(
            id,
            update,
            { new: true, session }
        );
    };
}