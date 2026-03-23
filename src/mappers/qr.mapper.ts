import { IQrCodeDocument, QrGenerateResponseDto } from "../types/qr.type";

export const toQrGenerateResponseDto = (
  qr: IQrCodeDocument,
  qrImage: string
): QrGenerateResponseDto => {
  return {
    qrImage,
    expiresAt: qr.expiresAt!,
  };
};