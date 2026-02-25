// interfaces/repository/notification.repository.interface.ts
import { Types } from "mongoose";
import {
  CreateNotificationDTO,
  INotification,
  INotificationDocument,
} from "../../types/notification.types";

export interface INotificationRepository {
  create(
    data: CreateNotificationDTO
  ): Promise<INotificationDocument>;

  findByUserId(
    userId: Types.ObjectId
  ): Promise<INotification[]>;

  markAsRead(
    notificationId: Types.ObjectId
  ): Promise<INotification | null>;

  getUnreadCount(
    userId: Types.ObjectId
  ): Promise<number>;
}