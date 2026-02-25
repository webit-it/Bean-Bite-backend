import { Document, Types } from "mongoose";

export interface INotification {
  customer: Types.ObjectId;
  product?: Types.ObjectId;
  reward?: Types.ObjectId; 
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface INotificationDocument
  extends INotification,
    Document {}

export interface CreateNotificationDTO {
  customer: Types.ObjectId;
  product?: Types.ObjectId;
  reward?: Types.ObjectId;
  message: string;
}