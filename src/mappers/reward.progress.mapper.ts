import { CustomerRewardProgressResponseDto, ICustomerRewardProgressDocument, ICustomerRewardProgressPopulated } from "../types/customerRewardProgress.type";

export class CustomerRewardProgressMapper {
  static toResponse(
    doc: ICustomerRewardProgressPopulated
  ): CustomerRewardProgressResponseDto {

    const redeemedProduct = doc.redeemedProduct
      ? {
        id: doc.redeemedProduct._id.toString(),
        productName: doc.redeemedProduct.productName,
        slug: doc.redeemedProduct.slug,
        image: doc.redeemedProduct.image,
      }
      : null;

    const reward = {
      id: doc.reward._id.toString(),
      rewardName: doc.reward.rewardName,
    };

    return {
      customer: doc.customer.toString(),
      reward,
      redeemedProduct,
      level: doc.level,
      slotCount: doc.slotCount,
      filledSlots: doc.filledSlots,
      status: doc.status,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      redeemedAt: doc.redeemedAt,
      updatedAt: doc.updatedAt,
    };
  }


  static toResponseFromDocument(
    doc: ICustomerRewardProgressDocument
  ): CustomerRewardProgressResponseDto {
    return {
      customer: doc.customer.toString(),
      reward: {
        id: doc.reward.toString(),
        rewardName: "",
      },
      redeemedProduct: null,
      level: doc.level,
      slotCount: doc.slotCount,
      filledSlots: doc.filledSlots,
      status: doc.status,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      redeemedAt: doc.redeemedAt,
      updatedAt: doc.updatedAt,
    };
  }

}
