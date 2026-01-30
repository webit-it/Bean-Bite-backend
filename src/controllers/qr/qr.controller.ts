import { Request, Response } from "express";
import { IQrService } from "../../interfaces/service/qr/qr.interface";
import HttpStatus from "../../constants/httpsStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { IQrController } from "../../interfaces/controller/qr/qr.controller";

export class QrController implements IQrController {
    constructor(private _qrService: IQrService) { }
    generateQr = async (req: Request, res: Response) => {
        try {
            const qr=await this._qrService.generate()
            res.status(HttpStatus.CREATED).json({
                success: true,
                qr,
            });
        } catch (error: unknown) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    }
}