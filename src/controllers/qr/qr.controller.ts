import { Request, Response } from "express";
import { IQrService } from "../../interfaces/service/qr/qr.interface";
import HttpStatus from "../../constants/httpsStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { IQrController } from "../../interfaces/controller/qr/qr.controller";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { Messages } from "../../constants/messages";

export class QrController implements IQrController {
    constructor(private _qrService: IQrService) { }
    generateQr = async (req: Request, res: Response) => {
        try {
            const qr = await this._qrService.generate()
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
    verifyQr = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { code } = req.body;
            const customerId = req.user?.id;
            if (!customerId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED_ACCESS });
                return
            }
            const result = await this._qrService.verify(code, customerId);

            res.status(HttpStatus.CREATED).json({
                ...result
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