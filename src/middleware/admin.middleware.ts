import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import HttpStatus from "../constants/httpsStatusCode";

export const adminOnly = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user?.isAdmin) {
       res.status(HttpStatus.FORBIDDEN).json({ 
        success: false, 
        message: "Access denied. Admin privileges required" 
      });
      return
    }
    
    next();
  };

 export  default adminOnly