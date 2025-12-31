import { Document } from "mongoose";

export interface ICustomer {
  fullName: string;
  phoneNumber: string;
  password: string;
  isAdmin: boolean;
  otp?: string|null;
  otpExpires?: Date|null;
}
export interface ICustomerDocument extends ICustomer, Document {}