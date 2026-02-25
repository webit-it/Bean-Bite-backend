import mongoose, { model, Schema } from "mongoose";
import { INotification, INotificationDocument } from "../types/notification.types";

const notificationSchema = new Schema<INotificationDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    reward:{
      type: Schema.Types.ObjectId,
      ref:'UserRewardProgress'
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);
export default mongoose.model<INotificationDocument>(
  "Notification",
  notificationSchema
);
