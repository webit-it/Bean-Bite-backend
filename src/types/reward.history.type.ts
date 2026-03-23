import { Types, HydratedDocument } from "mongoose";
import {  ICustomerDocument } from "./customer.type";
import {  IRewardDocument } from "./reward.type";
import {  IProductDocument } from "./product.type";

export interface IRewardHistory {
  _id:Types.ObjectId
  customer: Types.ObjectId|ICustomerDocument;
  reward: Types.ObjectId|IRewardDocument;
  level: number;
  slotCount: number;
  status: "COMPLETED" | "REDEEMED"|"IN_PROGRESS";
  action: "SLOT_FILLED"| "LEVEL_COMPLETED";
  redeemedProduct?: Types.ObjectId|null|IProductDocument;
  completedAt?: Date|null;
  redeemedAt?: Date
  createdAt: Date;
  updatedAt: Date;
}

export type IRewardHistoryDocument = HydratedDocument<IRewardHistory>;



export interface RewardHistoryResponseDto {
  id: string;

  level: number;
  slotCount: number;

  action: "SLOT_FILLED" | "LEVEL_COMPLETED";
  status: "IN_PROGRESS" | "COMPLETED" | "REDEEMED";

  completedAt?: Date;
  createdAt: Date;
  redeemedAt?: Date;
  updatedAt: Date;

  customer: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };

  reward: {
    id: string;
    rewardName: string;
    slug: string;
    slotCount: number;
  };

  redeemedProduct: {
    id: string;
    productName: string;
    slug: string;
    image?: string;
  } | null;
}

export interface PaginatedRewardHistoryResponse {
  data: RewardHistoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedHistory<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}