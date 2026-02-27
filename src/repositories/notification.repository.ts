import notificationModel from "../models/notification.model";
import { Types } from "mongoose";
import { BaseRepository } from "./base.reposiory";
import {
  INotificationDocument,
} from "../types/notification.types";
import { INotificationRepository } from "../interfaces/repository/notification.repository.interface";

export class NotificationRepository
  extends BaseRepository<INotificationDocument>
  implements INotificationRepository {
  constructor() {
    super(notificationModel);
  }

  async create(
    data: Partial<INotificationDocument>
  ): Promise<INotificationDocument> {
    return this.model.create(data);
  }

  async findByUserId(customer: Types.ObjectId) {
    return this.model
      .find({ customer, isRead: false })
      .sort({ createdAt: -1 })
      .populate("product", "productName price");
  }

  async markAsRead(notificationId: Types.ObjectId) {
    return this.model.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }
  async markAllAsRead(customer: Types.ObjectId) {
    return this.model.updateMany(
      { customer, isRead: false },
      { $set: { isRead: true } }
    );
  }
  async getUnreadCount(customer: Types.ObjectId) {
    return this.model.countDocuments({
      customer,
      isRead: false,
    });
  }
}