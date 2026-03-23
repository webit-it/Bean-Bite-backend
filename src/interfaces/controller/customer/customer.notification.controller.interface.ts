import { Request, Response } from "express";
import { INotification, NotificationResponseDto } from "../../../types/notification.types";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

export interface INotificationControllerInterface {
  getMyNotifications(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<{success:boolean,data:NotificationResponseDto[]}>;
  markAsRead(
    req: Request,
    res: Response
  ): Promise<void>;
  markAllAsRead(
    req: Request,
    res: Response
  ): Promise<{sucess:true}>;
}