import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { ICustomerAuthService } from "../../interfaces/service/customer/auth.customer.interface";
import { generateRefreshToken, generateToken, getCookieOptions, verifyRefreshToken } from "../../utils/jwt";

interface IServiceError {
  message: string;
  status?: number;
}

dotenv.config();

const accessTokenMaxAge =
  Number(process.env.ACCESS_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 30 * 24 * 60 * 60 * 1000;

export class CustomerAuthController {
  constructor(private _customerAuthService: ICustomerAuthService) { }

  register = async (req: Request, res: Response) => {
    const { userName, phoneNumber, password } = req.body;
    try {
      const { customer, token, refreshToken } =
        await this._customerAuthService.register(
          userName,
          phoneNumber,
          password
        );

       res.cookie(
        "access_token", 
        token, 
        getCookieOptions(accessTokenMaxAge)
      );

      res.cookie(
        "refresh_token",
         refreshToken,
         getCookieOptions(refreshTokenMaxAge)
   );
      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.REGISTER_SUCCESS,
        customer,
      });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      res.status(serviceError.status || 500).json({
        message: serviceError.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    const { phoneNumber, password } = req.body;
    try {
      const { customer, token, refreshToken } =
        await this._customerAuthService.Login(phoneNumber, password);

      res.cookie(
        "access_token", 
        token, 
        getCookieOptions(accessTokenMaxAge)
      );

      res.cookie(
        "refresh_token",
         refreshToken,
         getCookieOptions(refreshTokenMaxAge)
   );

      res.status(HttpStatus.OK).json({
        success: true,
        customer,
      });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      res.status(serviceError.status || 500).json({
        message: serviceError.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
  refreshAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message:Messages.REFRESH_TOKEN_MISSING});
    }

    try {
      const decoded = verifyRefreshToken(refreshToken)

      const customer = await this._customerAuthService.findById(decoded.id);

      if (!customer ) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.INVALID_REFRESH_TOCKEN });
      }

      const newAccessToken = generateToken(decoded.id, decoded.isAdmin);
      const newRefreshToken = generateRefreshToken(decoded.id, decoded.isAdmin);

      await this._customerAuthService.updateRefreshToken(
        decoded.id,
        newRefreshToken
      );

       res.cookie(
        "access_token", 
        newAccessToken, 
        getCookieOptions(accessTokenMaxAge)
      );

      res.cookie(
        "refresh_token",
         newRefreshToken,
         getCookieOptions(refreshTokenMaxAge)
   );

      return res.status(HttpStatus.OK).json({ success: true });
    } catch {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message:Messages.REFRESH_TOKEN_EXPIRED});
    }
  };
  logoutUser = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        await this._customerAuthService.clearRefreshToken(refreshToken);
      }

      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.LOGOUT_SUCCESS,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.LOGOUT_FAILED });
    }
  };

  // ================= OTP =================
  verifyOtp = async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body;
    try {
      const { token, message } =
        await this._customerAuthService.verifyOtp(phoneNumber, otp);

      res.status(HttpStatus.OK).json({
        success: true,
        token,
        message,
      });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      res.status(serviceError.status || 500).json({
        message: serviceError.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    try {
      const message =
        await this._customerAuthService.resendOtp(phoneNumber);
      res.status(HttpStatus.OK).json({ success: true, message });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      res.status(serviceError.status || 500).json({
        message: serviceError.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  // ================= FORGOT / RESET =================
  verifyCustomer = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    try {
      const customer =
        await this._customerAuthService.verifyCustomer(phoneNumber);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Successfully Completed",
        customer,
      });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      res.status(serviceError.status || 500).json({
        message: serviceError.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    try {
      const customer =
        await this._customerAuthService.resetPassword(token, password);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Successfully Completed",
        customer,
      });
    } catch (error: unknown) {
      const serviceError = error as IServiceError;
      res.status(serviceError.status || 500).json({
        message: serviceError.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}