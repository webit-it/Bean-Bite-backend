import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpStatus from "../constants/httpsStatusCode";
dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: { id: string; isAdmin: boolean };
}
export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.access_token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string; isAdmin: boolean };

     req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin,
    };
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};
