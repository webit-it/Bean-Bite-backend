import { IRewardHistoryDocument, RewardHistoryResponseDto } from "../types/reward.history.type";

export class RewardHistoryMapper {

    static toResponse(
        doc: IRewardHistoryDocument
    ): RewardHistoryResponseDto {
        const customer =
            doc.customer &&
                typeof doc.customer === "object" &&
                "fullName" in doc.customer
                ? {
                    id: doc.customer._id.toString(),
                    fullName: doc.customer.fullName,
                    phoneNumber: doc.customer.phoneNumber,
                }
                : {
                    id: doc.customer ? doc.customer.toString() : "",
                    fullName: "",
                    phoneNumber: "",
                };
        const reward =
            doc.reward &&
                typeof doc.reward === "object" &&
                "rewardName" in doc.reward
                ? {
                    id: doc.reward._id.toString(),
                    rewardName: doc.reward.rewardName,
                    slug: doc.reward.slug,
                    slotCount: doc.reward.slotCount,
                }
                : {
                    id: doc.reward ? doc.reward.toString() : "",
                    rewardName: "",
                    slug: "",
                    slotCount: 0,
                };
        const redeemedProduct =
            doc.redeemedProduct &&
                typeof doc.redeemedProduct === "object" &&
                "productName" in doc.redeemedProduct
                ? {
                    id: doc.redeemedProduct._id.toString(),
                    productName: doc.redeemedProduct.productName,
                    slug: doc.redeemedProduct.slug,
                    image: doc.redeemedProduct.image,
                }
                : doc.redeemedProduct
                    ? {
                        id: doc.redeemedProduct.toString(),
                        productName: "",
                        slug: "",
                        image: "",
                    }
                    : null;

        return {
            id: doc._id.toString(),

            level: doc.level,
            slotCount: doc.slotCount,
            action: doc.action,
            status: doc.status,

            completedAt: doc.completedAt?? undefined,
            redeemedAt: doc.redeemedAt?? undefined,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            customer,
            reward,
            redeemedProduct,
        };
    }

    static toResponseList(
        docs: IRewardHistoryDocument[]
    ): RewardHistoryResponseDto[] {
        return docs.map((doc) => this.toResponse(doc));
    }
}