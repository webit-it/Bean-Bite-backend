import { HydratedDocument } from "mongoose";

export interface IQRCode {
  code: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date
}


export type IQrCodeDocument = HydratedDocument<IQRCode>;


export interface QrGenerateResponseDto {
  qrImage: string;
  expiresAt: Date;
}
