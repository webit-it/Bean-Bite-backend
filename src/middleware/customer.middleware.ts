import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isCustomer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Customer access only",
    });
  }

  next();
};
