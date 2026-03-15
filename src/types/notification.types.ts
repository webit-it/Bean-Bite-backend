import { Document, Types } from "mongoose";
import { IProductDocument, ProductResponseDto } from "./product.type";
import { IRewardDocument } from "./reward.type";

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
  Document { }

export interface CreateNotificationDTO {
  customer: Types.ObjectId;
  product?: Types.ObjectId;
  reward?: Types.ObjectId;
  message: string;
}

export interface NotificationResponseDto {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  product: ProductResponseDto | null;
  reward: {
    id: string;
    level?: number;
  } | null;
}

export interface PaginatedNotificationResponse {
  data: NotificationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedNotification<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}