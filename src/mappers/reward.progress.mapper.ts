import { CustomerRewardProgressResponseDto, ICustomerRewardProgressPopulated } from "../types/customerRewardProgress.type";

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

    return {
      customer: doc.customer.toString(),
      reward: doc.reward.toString(),
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
}
