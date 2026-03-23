import { Types, UpdateResult } from "mongoose";
import {
  CreateNotificationDTO,
  INotification,
  INotificationDocument,
  PaginatedNotification,
} from "../../types/notification.types";

export interface INotificationRepository {
  create(
    data: Partial<INotificationDocument>
  ): Promise<INotificationDocument>

  findByUserId(
    userId: Types.ObjectId
  ): Promise<INotificationDocument[]>;

  markAsRead(
    notificationId: Types.ObjectId
  ): Promise<INotificationDocument | null>;
  markAllAsRead(
    customer: Types.ObjectId
  ): Promise<UpdateResult>;

  getUnreadCount(
    userId: Types.ObjectId
  ): Promise<number>;

   findAllPaginated(
      page: number,
      limit: number,
    ): Promise<PaginatedNotification<INotificationDocument>>;
}