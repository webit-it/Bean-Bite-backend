import { Request, Response } from "express";
import { Types } from "mongoose";
import ICategoryController from "../../interfaces/controller/admin/category.controller.interface";
import ICategoryServiceInterface from "../../interfaces/service/admin/category.service.interface";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AppError from "../../utils/AppError";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";

export class CategoryController implements ICategoryController {
  constructor(private _categoryService: ICategoryServiceInterface) {}
  create = async (req: Request, res: Response) => {
    try {
      const { categoryName, description, slug } = req.body;

      if (!categoryName || !description) {
        throw new AppError(
          Messages.CATEGORY_NAME_AND_DESCRIPTION_REQUIRED,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!req.file) {
        throw new AppError(
          Messages.IMAGE_REQUIRED,
          HttpStatus.BAD_REQUEST
        );
      }

      await this._categoryService.createCategory({
        categoryName,
        description,
        slug,
        imageBuffer: req.file.buffer,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.CATEGORY_CREATED_SUCCESSFULLY,
      });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
  getCategoryBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      console.log("controller slug:", slug);

      const category = await this._categoryService.getCategoryForEdit(slug);

      res.status(HttpStatus.OK).json({
        success: true,
        data: category,
      });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
  editCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { categoryName, description, status, slug } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(
          Messages.INVALID_CATEGORY_ID,
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedData: any = {
        categoryName,
        description,
        status,
        slug,
      };

      if (req.file) {
        updatedData.imageBuffer = req.file.buffer;
      }

      await this._categoryService.updateCategory(id, updatedData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.CATEGORY_UPDATED_SUCCESSFULLY,
      });
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
  getAllCategories = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
      const search = req.query.search as string | undefined;

      const result =
        await this._categoryService.getAllCategories(page, limit, search);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error: unknown) {
      console.log("Get all categories controller error:", error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
  toggleCategoryStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(
          Messages.INVALID_CATEGORY_ID,
          HttpStatus.BAD_REQUEST
        );
      }
      await this._categoryService.toggleCategoryStatus(id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.CATEGORY_STATUS_TOGGLED,
      });
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}

