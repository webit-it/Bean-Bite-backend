import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const multerErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
     if (err instanceof Error && err.message === "INVALID_IMAGE_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Only JPG, JPEG, and PNG images are allowed",
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size must be less than 2MB",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Only one image is allowed",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

 

  next(err);
};
