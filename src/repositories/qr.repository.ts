import { ClientSession } from "mongoose";
import { IQrRepository } from "../interfaces/repository/qr.repository.interface";
import { QrCode } from "../models/qrCode.model";
import { IQrCodeDocument } from "../types/qr.type";
import { BaseRepository } from "./base.reposiory";

export class QrRepository extends BaseRepository<IQrCodeDocument> implements IQrRepository {
    constructor() {
        super(QrCode)
    }
    async findByCode(
        code: string,
        session?: ClientSession
    ) {
        return QrCode.findOne({ code })
            .session(session ?? null)
            .lean();
    }
    async markAsUsedIfValid(
        code: string,
        session?: ClientSession
    ) {
        return QrCode.findOneAndUpdate(
            {
                code,
                isUsed: false,
            },
            {
                $set: {
                    isUsed: true,
                    usedAt: new Date(),
                },
            },
            {
                new: true,
                session,
            }
        );
    }
}