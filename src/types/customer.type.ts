import { Document } from "mongoose";

export type CustomerSearchQuery = {
  isAdmin?: boolean;
  $or?: Array<{
    fullName?: { $regex: string; $options: string };
    phoneNumber?: { $regex: string; $options: string };
  }>;
};




export interface ICustomer {
  fullName: string;
  phoneNumber: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;

  /** 🔐 Auth */
  refreshToken?: string | null;

  /** 🔢 OTP */
  otp?: string | null;
  otpExpires?: Date | null;

  createdAt: Date;
}

export interface ICustomerDocument extends ICustomer, Document {}

export interface ICustomerDocument extends ICustomer, Document {}

export interface AdminLoginDTO {
  phoneNumber: string;
  password: string;
}

export interface PaginatedCustomers {
  data: ICustomer[]; 
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedCustomerResponse {
  data: CustomerResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface UpdateCustomerStatusDTO {
  status: boolean;
}

export interface CustomerResponseDTO {
  id: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
}
