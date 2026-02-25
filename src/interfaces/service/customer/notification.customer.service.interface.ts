import { Types } from "mongoose";
import {
  CreateNotificationDTO,
  INotification,
  INotificationDocument,
} from "../../../types/notification.types";

export interface INotificationServiceInterface {
  createNotification(
    data: CreateNotificationDTO
  ): Promise<INotificationDocument>;

  getUserNotifications(
    customer: Types.ObjectId
  ): Promise<INotification[]>;

  markAsRead(
    notificationId: Types.ObjectId
  ): Promise<INotification | null>;

  getUnreadCount(
    customer: Types.ObjectId
  ): Promise<number>;
}