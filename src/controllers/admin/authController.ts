import { Request, Response } from "express";
import { IAdminAuthService } from "../../interfaces/service/admin/auth.admin.interface";
import HttpStatus from "../../constants/httpsStatusCode";
import { AdminLoginDTO } from "../../types/customer.type";
import { IAdminAuthController } from "../../interfaces/controller/admin/admin.auth.controller.interface";

export class AdminAuthController implements IAdminAuthController {
  constructor(private _adminAuthService: IAdminAuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, password } = req.body as AdminLoginDTO;

      const { user, token } =
        await this._adminAuthService.adminLogin(phoneNumber, password);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, 
      });

      res.status(HttpStatus.OK).json({
        success: true,
        user,
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Server error",
      });
    }
  };
}
