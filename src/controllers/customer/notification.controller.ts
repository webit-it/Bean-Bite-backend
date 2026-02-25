import { Request, Response } from "express";
import { Types } from "mongoose";
import {INotificationServiceInterface } from "../../interfaces/service/customer/notification.customer.service.interface";
import { INotificationControllerInterface } from "../../interfaces/controller/customer/customer.notification.controller.interface";

export class NotificationController implements INotificationControllerInterface {
 constructor(private _notificationService: INotificationServiceInterface) { }

  async getMyNotifications(req: Request, res: Response) {
    try {
     const customer = (req as Request & { customer: Types.ObjectId }).customer;

      const notifications =
        await this._notificationService.getUserNotifications(
          new Types.ObjectId(customer)
        );

      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const notification =
        await this._notificationService.markAsRead(
          new Types.ObjectId(id)
        );

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update notification",
      });
    }
  }

  async unreadCount(req: Request, res: Response) {
    try {
      const customer = (req as Request & { customer: Types.ObjectId }).customer;

      const count =
        await this._notificationService.getUnreadCount(
          new Types.ObjectId(customer)
        );

      res.status(200).json({
        success: true,
        count,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to get unread count",
      });
    }
  }
}

