import { IQrRepository } from "../interfaces/repository/qr.repository.interface";
import { QrCode } from "../models/qrCode.model";
import { IQrCodeDocument } from "../types/qr.type";
import { BaseRepository } from "./base.reposiory";

export class QrRepository extends BaseRepository<IQrCodeDocument> implements IQrRepository {
    constructor() {
        super(QrCode)
    }
    async findByCode(code: string) {
        return await QrCode.findOne({ code })
    }
    async markAsUsed(code: string) {
        return await QrCode.findOneAndUpdate({ code: code }, { isUsed: true }, { new: true })
    }
}