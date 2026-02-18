import { ClientSession } from "mongoose";
import { IRewardHistory, IRewardHistoryDocument } from "../../types/reward.history.type";

export interface IRewardHIstoryRepo{
    create(data:Partial<IRewardHistory>, session?: ClientSession):Promise<IRewardHistoryDocument>
    findByIdWithSession(historyId:string,session?: ClientSession):Promise<IRewardHistoryDocument>
    findAll():Promise<IRewardHistoryDocument[]>
}