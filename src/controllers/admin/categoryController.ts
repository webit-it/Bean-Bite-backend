import { Request, Response } from "express";
import { Types } from "mongoose";
import ICategoryController from "../../interfaces/controller/admin/category.controller.interface";
import ICategoryServiceInterface from "../../interfaces/service/admin/category.service.interface";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class CategoryController implements ICategoryController {
  constructor(private _categoryService: ICategoryServiceInterface) {

  }
  create = async (req: Request, res: Response) => {
    try {
      const { categoryName, description, slug } = req.body;

      if (!categoryName || !description) {
        res.status(400).json({
          success: false,
          message: "categoryName and description are required",
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Image is required",
        });
        return;
      }

      await this._categoryService.createCategory({
        categoryName,
        description,
        slug,
        imageBuffer: req.file.buffer,
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully",
      });
    } catch (error: unknown) {
      res.status(400).json({
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

      const category =
        await this._categoryService.getCategoryForEdit(slug);

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: unknown) {
      res.status(400).json({
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
        res.status(400).json({ message: "Invalid category ID" });
        return;
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

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
      });
    } catch (error: unknown) {
      res.status(400).json({
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

    res.status(200).json({
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

    res.status(500).json({
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
      await this._categoryService.toggleCategoryStatus(id);

      res.status(200).json({
        success: true,
        message: "Category status toggled",
      });
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}

