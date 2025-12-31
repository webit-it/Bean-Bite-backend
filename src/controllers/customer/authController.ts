import { Request, Response } from "express";
import dotenv from "dotenv";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { ICustomerAuthService } from "../../interfaces/service/customer/auth.customer.interface";

interface IServiceError {
  message: string;
  status?: number;
}

dotenv.config();

const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 6 * 60 * 60 * 1000;
const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

export class CustomerAuthController {
  constructor(private _customerAuthService: ICustomerAuthService) { }
  register = async (req: Request, res: Response) => {
    const { userName, phoneNumber, password } = req.body;
    try {
      const { customer, token, refreshToken } = await this._customerAuthService.register(
        userName,
        phoneNumber,
        password,
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json(customer);
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
      const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({ message });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const { user, token, refreshToken } = await this._customerAuthService.Login(email, password);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json(user);
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
      const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({ message });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
      const { customer, message } = await this._customerAuthService.verifyOtp(email, otp);
      res.status(HttpStatus.OK).json({
        message,
        user: {
          _id: customer._id,
          phoneNumber: customer.phoneNumber,
          userName: customer.fullName,
          isAdmin: customer.isAdmin,
        },
      });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
      const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({ message });
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const message = await this._customerAuthService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
      const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({ message });
    }
  }
  logoutUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "User ID is required" });
        return;
      }

      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      res.status(HttpStatus.OK).json({ message: Messages.LOGOUT_SUCCESS });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : Messages.LOGOUT_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const customer = await this._customerAuthService.forgotPassword(email);
      res.status(HttpStatus.OK).json({ success: true, message: "Successfully Completed", customer });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
      const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(status).json({ message });
    }
  };
}