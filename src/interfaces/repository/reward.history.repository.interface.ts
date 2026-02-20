import { ClientSession } from "mongoose";
import { IRewardHistory, IRewardHistoryDocument } from "../../types/reward.history.type";

export interface IRewardHIstoryRepo{
    createHistory(data:Partial<IRewardHistory>, session?: ClientSession):Promise<IRewardHistoryDocument>
    findByIdWithSession(id:string,session?: ClientSession):Promise<IRewardHistoryDocument|null>
    findAll():Promise<IRewardHistoryDocument[]>
}