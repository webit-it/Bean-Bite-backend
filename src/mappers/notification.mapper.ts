import mongoose from "mongoose";
import {
  INotificationDocument,
  NotificationResponseDto,
} from "../types/notification.types";
import { IProductDocument } from "../types/product.type";
import { ICustomerRewardProgressDocument } from "../types/customerRewardProgress.type";

export class NotificationMapper {
  static toResponse(doc: INotificationDocument): NotificationResponseDto {
    let product: any = null;

    if (doc.product && !(doc.product instanceof mongoose.Types.ObjectId)) {
      const productDoc = doc.product as IProductDocument;

      product = {
        id: productDoc._id.toString(),
        productName: productDoc.productName,
        price: productDoc.price,
      };
    } else if (doc.product) {
      product = {
        id: doc.product.toString(),
      };
    }

    let reward: any = null;

    if (doc.reward && !(doc.reward instanceof mongoose.Types.ObjectId)) {
      const rewardDoc = doc.reward as ICustomerRewardProgressDocument;

      reward = {
        id: rewardDoc._id.toString(),
        level: rewardDoc.level,
      };
    } else if (doc.reward) {
      reward = {
        id: doc.reward.toString(),
      };
    }

    return {
      id: doc._id.toString(),
      message: doc.message,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
      product,
      reward,
    };
  }

  static toResponseList(
    notifications: INotificationDocument[]
  ): NotificationResponseDto[] {
    return notifications.map((notification) =>
      this.toResponse(notification)
    );
  }
}