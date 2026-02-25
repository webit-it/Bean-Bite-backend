import { Request, Response } from "express";

export interface INotificationControllerInterface {
  getMyNotifications(
    req: Request,
    res: Response
  ): Promise<void>;

  markAsRead(
    req: Request,
    res: Response
  ): Promise<void>;

  unreadCount(
    req: Request,
    res: Response
  ): Promise<void>;
}