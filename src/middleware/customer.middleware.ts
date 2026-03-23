import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export const isCustomer = (
  req: AuthenticatedRequest,
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
