import { ClientSession, PipelineStage, UpdateQuery } from "mongoose";
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
    findByIdWithSession = async (
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
    async findAllWithDetails(
        search = "",
        action: "SLOT_FILLED" | "LEVEL_COMPLETED",
        skip = 0,
        limit = 10
    ) {
        const matchStage: Partial<{
            action: "SLOT_FILLED" | "LEVEL_COMPLETED";
        }> = {};

        if (action) {
            matchStage.action = action;
        }

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: "$customer" },
            {
                $lookup: {
                    from: "rewards",
                    localField: "reward",
                    foreignField: "_id",
                    as: "reward"
                }
            },
            { $unwind: "$reward" },
            {
                $lookup: {
                    from: "products",
                    localField: "redeemedProduct",
                    foreignField: "_id",
                    as: "redeemedProduct"
                }
            },
            {
                $unwind: {
                    path: "$redeemedProduct",
                    preserveNullAndEmptyArrays: true
                }
            }
        ];
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "customer.fullName": { $regex: search, $options: "i" } },
                        { "customer.phoneNumber": { $regex: search, $options: "i" } },
                        { "reward.rewardName": { $regex: search, $options: "i" } },
                        { "redeemedProduct.productName": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }
        pipeline.push({
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },

                    {
                        $project: {
                            level: 1,
                            slotCount: 1,
                            action: 1,
                            status: 1,
                            completedAt: 1,

                            customer: {
                                fullName: "$customer.fullName",
                                phoneNumber: "$customer.phoneNumber"
                            },

                            reward: {
                                rewardName: "$reward.rewardName",
                                slug: "$reward.slug",
                                slotCount: "$reward.slotCount"
                            },

                            redeemedProduct: {
                                productName: "$redeemedProduct.productName",
                                slug: "$redeemedProduct.slug",
                                image: "$redeemedProduct.image"
                            }
                        }
                    }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        });

        const result = await this.model.aggregate(pipeline);

        return {
            data: result[0].data,
            totalCount: result[0].totalCount[0]?.count || 0
        };
    }
}