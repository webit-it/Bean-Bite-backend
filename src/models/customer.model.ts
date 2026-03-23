import { model, Schema } from "mongoose";
import { ICustomerDocument } from "../types/customer.type";

const customerSchema = new Schema<ICustomerDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    isActive:{
      type:Boolean,
      default:true
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

export const Customer = model<ICustomerDocument>("Customer", customerSchema);

