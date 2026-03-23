import { Request, Response } from "express";
import { Types } from "mongoose";
import { INotificationControllerInterface } from "../../interfaces/controller/customer/customer.notification.controller.interface";
import { INotificationService } from "../../interfaces/service/customer/notification.customer.service.interface";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

export class NotificationController {
  constructor(private _notificationService: INotificationService) { }

  getMyNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED_ACCESS });
      }

      const notifications = await this._notificationService.getNotification(
        customerId
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

   markAsRead=async(req: Request, res: Response)=>{
    try {
      const { id } = req.params;
      await this._notificationService.markAsRead(
        id
      );

      res.status(200).json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update notification",
      });
    }
  }
   markAllAsRead=async(req: AuthenticatedRequest, res: Response)=> {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED_ACCESS });
      }

      await this._notificationService.markAllAsRead(
        customerId
      );

      res.status(200).json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update notification",
      });
    }
  }
}

