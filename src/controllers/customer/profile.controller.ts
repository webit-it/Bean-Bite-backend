import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import HttpStatus from "../../constants/httpsStatusCode";
import { IProfileService } from "../../interfaces/service/customer/profile.customer.interface";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { Messages } from "../../constants/messages";

export class ProfileController {
    constructor(private _profileService: IProfileService) { }
    getProfile = async (req: AuthenticatedRequest, res: Response) => {
        const customerId = req.user?.id;
        if (!customerId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED_ACCESS});
        }
        try {
            const customer = await this._profileService.getProfile(customerId)
            res.status(HttpStatus.CREATED).json({
                success: true,
                customer,
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
    // editProfile = async (req: AuthenticatedRequest, res: Response) => {
    //     const customerId = req.user?.id;
    //     const {fullName,phoneNumber}=req.body
    //     console.log(req.body)
    //     if (!customerId) {
    //         return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED_ACCESS});
    //     }
    //     try {
    //         const customer=await this._profileService.editProfile(customerId,fullName,phoneNumber)
    //         res.status(HttpStatus.CREATED).json({
    //             success: true,
    //             customer
    //         });
    //     } catch (error: unknown) {
    //         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //             success: false,
    //             message: error instanceof Error
    //                 ? error.message
    //                 : ERROR_MESSAGES.SERVER_ERROR,
    //         });
    //     }
    // }
}