import mongoose, { Schema } from "mongoose";
import { IQRCode, IQrCodeDocument } from "../types/qr.type";

const QRCodeSchema: Schema = new Schema<IQRCode>({
  code: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const QrCode = mongoose.model<IQrCodeDocument>(
  "QrCode",
  QRCodeSchema
);