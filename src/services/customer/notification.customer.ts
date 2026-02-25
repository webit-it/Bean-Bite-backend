// services/customer/notification.service.ts
import { Types } from "mongoose";
import { INotificationServiceInterface } from "../../interfaces/service/customer/notification.customer.service.interface";
import { INotificationRepository } from "../../interfaces/repository/notification.repository.interface";
import { CreateNotificationDTO } from "../../types/notification.types";

export class NotificationService
  implements INotificationServiceInterface
{
  constructor(
    private _notificationRepository: INotificationRepository
  ) {}

  async createNotification(data: CreateNotificationDTO) {
    return this._notificationRepository.create(data);
  }

  async getUserNotifications(customer: Types.ObjectId) {
    return this._notificationRepository.findByUserId(customer);
  }

  async markAsRead(notificationId: Types.ObjectId) {
    return this._notificationRepository.markAsRead(notificationId);
  }

  async getUnreadCount(customer: Types.ObjectId) {
    return this._notificationRepository.getUnreadCount(customer);
  }
}