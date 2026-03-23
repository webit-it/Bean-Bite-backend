import mongoose, { Types } from "mongoose";
import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import { ICustomerAuthRepo } from "../../interfaces/repository/customer.auth.repository.inerface";
import { INotificationRepository } from "../../interfaces/repository/notification.repository.interface";
import { NotificationMapper } from "../../mappers/notification.mapper";
import { INotificationService } from "../../interfaces/service/customer/notification.customer.service.interface";

export class NotificationService implements INotificationService {
  constructor(private _customerRepo: ICustomerAuthRepo, private _notificationRepo: INotificationRepository) { }
  getNotification = async (customerId: string) => {
    try {
      const customer = await this._customerRepo.findById(customerId)
      if (!customer) {
        throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
      }
      const customerObjectId = new mongoose.Types.ObjectId(customerId);
      const notifications = await this._notificationRepo.findByUserId(customerObjectId)
      return NotificationMapper.toResponseList(notifications)
    } catch (error) {
      console.log("Error get notification", error)
      throw error
    }
  }
  markAsRead = async (notificationId: string) => {
    console.log(notificationId,"notification id")
    try {
      const notificatioObj = new Types.ObjectId(notificationId)
      const notification = await this._notificationRepo.markAsRead(notificatioObj)
      if (!notification) {
        throw { status: HttpStatus.NOT_FOUND, message: Messages.NOTIFICATION_NOT_FOUND };
      }
      return
    } catch (error) {
      console.log("Error mark as read notification", error)
      throw error
    }
  }
  markAllAsRead = async (customerId: string) => {
    try {
      const customer = await this._customerRepo.findById(customerId)
      if (!customer) {
        throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
      }
      const customerObjectId = new mongoose.Types.ObjectId(customerId);
      await this._notificationRepo.markAllAsRead(customerObjectId)
      return
    } catch (error) {
      console.log("Error mark all as read notification", error)
      throw error
    }
  }
}