import QRCode from "qrcode";
import { randomUUID } from "crypto";
import { IQrRepository } from "../../interfaces/repository/qr.repository.interface";
import { toQrGenerateResponseDto } from "../../mappers/qr.mapper";
import { IQrService } from "../../interfaces/service/qr/qr.interface";

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

    // async verify(code: string) {
    //     try {
    //         const qr = await QrCode.findOne({ code });

    //         if (!qr) throw new Error("Invalid QR");

    //         if (qr.isUsed) throw new Error("QR already used");

    //         if (qr.expiresAt && qr.expiresAt < new Date())
    //             throw new Error("QR expired");

    //         qr.isUsed = true;
    //         await qr.save();

    //         return qr;
    //     } catch (error) {

    //     }
    // }
}

