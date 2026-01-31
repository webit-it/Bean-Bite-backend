import QRCode from "qrcode";
import { randomUUID } from "crypto";
import { IQrRepository } from "../../interfaces/repository/qr.repository.interface";
import { toQrGenerateResponseDto } from "../../mappers/qr.mapper";
import { IQrService } from "../../interfaces/service/qr/qr.interface";
import AppError from "../../utils/AppError";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";

export class QRService implements IQrService {
    constructor(private _qrRepo: IQrRepository) { }
    generate = async () => {
        try {
            const code = randomUUID();
            const expirySeconds = Number(process.env.QR_EXPIRY_SECONDS) || 90;

            const expiresAt = new Date(
                Date.now() + expirySeconds * 1000
            );

            const createdQr = await this._qrRepo.create({ code, expiresAt })

            const qrImage = await QRCode.toDataURL(code);

            return toQrGenerateResponseDto(createdQr, qrImage)
        } catch (error) {
            console.log("Error in generate Qr code :", error)
            throw error
        }
    }

     verify=async(code: string)=> {
        try {
            const qr = await this._qrRepo.findByCode(code)
            if (!qr) {
                throw new AppError(
                    Messages.INVALID_QR,
                    HttpStatus.NOT_FOUND
                );
            }

            if (qr.isUsed) {
                throw new AppError(
                    Messages.QR_ALREADY_USED,
                    HttpStatus.NOT_FOUND
                );
            }

            if (qr.expiresAt && qr.expiresAt < new Date())
                throw new AppError(
                    Messages.QR_EXPIRED,
                    HttpStatus.NOT_FOUND
                );

            const updatedQr = await this._qrRepo.markAsUsed(code)

            if (!updatedQr) {
                throw new AppError(
                    Messages.INVALID_QR,
                    HttpStatus.NOT_FOUND
                );
            }

            return updatedQr;
        } catch (error) {
            console.log("Error in verify Qr code :", error)
            throw error
        }
    }
}

