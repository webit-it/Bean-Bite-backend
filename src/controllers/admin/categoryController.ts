import { Request, Response } from "express";
import { Types } from "mongoose";
import ICategoryController from "../../interfaces/controller/admin/category.controller.interface";
import ICategoryServiceInterface from "../../interfaces/service/admin/category.service.interface";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AppError from "../../utils/AppError";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { UpdateCategoryDTO } from "../../types/category.type";

export class CategoryController implements ICategoryController {
  constructor(private _categoryService: ICategoryServiceInterface) {}
create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryName, description, slug ,status} = req.body;

    if (!categoryName || !description || !slug) {
      throw new AppError(
        Messages.MISSING_FIELDS,
        HttpStatus.BAD_REQUEST
      );
    }

    if (!req.file) {
      throw new AppError(
        Messages.IMAGE_REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }

    const category = await this._categoryService.createCategory({
      categoryName,
      description,
      slug,
      imageBuffer: req.file.buffer,
      status
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: Messages.CATEGORY_CREATED_SUCCESSFULLY,
      data: category,
    });

  } catch (error: unknown) {
    res.status(
      error instanceof AppError
        ? error.statusCode
        : HttpStatus.BAD_REQUEST
    ).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};


  getCategoryBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const category = await this._categoryService.getCategoryBySlug(slug);

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
 editCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { categoryName, description, status, slug } = req.body;
       if (!categoryName || !description || !slug) {
      throw new AppError(
        Messages.MISSING_FIELDS,
        HttpStatus.BAD_REQUEST
      );
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(
        Messages.INVALID_CATEGORY_ID,
        HttpStatus.BAD_REQUEST
      );
    }

  const updatedData: UpdateCategoryDTO = {
      categoryName,
      description,
      status,
      slug,
    };

    if (req.file) {
      updatedData.imageBuffer = req.file.buffer;
    }

    const updatedCategory =
      await this._categoryService.updateCategory(id, updatedData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: Messages.CATEGORY_UPDATED_SUCCESSFULLY,
      data: updatedCategory, 
    });

  } catch (error: unknown) {
    res.status(
      error instanceof AppError
        ? error.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR
    ).json({
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
        console.log(result.data)

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
 
}

