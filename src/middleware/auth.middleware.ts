import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpStatus from "../constants/httpsStatusCode";
import { Messages } from "../constants/messages";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message:Messages.REFRESH_TOKEN_MISSING,
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; isAdmin: boolean };

    // attach user to request
    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error: any) {
    console.error("Error in verifyToken:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message:Messages.ACCESS_TOKEN_EXPIRED,
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: "Invalid access token",
    });
  }
};