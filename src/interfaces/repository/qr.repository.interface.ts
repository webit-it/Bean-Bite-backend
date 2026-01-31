import { IQRCode, IQrCodeDocument } from "../../types/qr.type";

export interface IQrRepository {
    create(data: Partial<IQRCode>): Promise<IQrCodeDocument>
    findByCode(code: string): Promise<IQrCodeDocument|null>
    markAsUsed(code: string): Promise<IQrCodeDocument|null>
}