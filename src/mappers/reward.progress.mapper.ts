import { Types } from "mongoose";
import {
  ICustomerRewardProgressDocument,
  CustomerRewardProgressResponseDto,
  RedeemedProductDto,
} from "../types/customerRewardProgress.type";

export class CustomerRewardProgressMapper {
  static toResponse(
    doc: ICustomerRewardProgressDocument
  ): CustomerRewardProgressResponseDto {

    const redeemedProduct =
      doc.redeemedProduct &&
      typeof doc.redeemedProduct === "object" &&
      "name" in doc.redeemedProduct
        ? {
            id: doc.redeemedProduct.id,
            name: doc.redeemedProduct.name,
            slug: doc.redeemedProduct.slug,
            image: doc.redeemedProduct.image,
          }
        : doc.redeemedProduct
        ? doc.redeemedProduct
        : null;

    return {
      customer: doc.customer,
      reward: doc.reward,
      radeemedProduct: redeemedProduct as
        | Types.ObjectId
        | RedeemedProductDto
        | null,
      level: doc.level,
      slotCount: doc.slotCount,
      FilledSlots: doc.filledSlots,
      status: doc.status,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      redeemedAt: doc.redeemedAt,
      updatedAt: doc.updatedAt,
    };
  }
}
