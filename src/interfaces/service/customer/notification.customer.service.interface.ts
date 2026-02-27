import { Types } from "mongoose";
import {
  CreateNotificationDTO,
  INotification,
  NotificationResponseDto,
} from "../../../types/notification.types";

export interface INotificationService {
  getNotification(
    customer: string
  ): Promise<NotificationResponseDto[]>;
  markAsRead(
    notificationId: string
  ): Promise<void>;
  markAllAsRead(
    customerId: string
  ): Promise<void>;
  // getUnreadCount(
  //   customer: Types.ObjectId
  // ): Promise<number>;
}