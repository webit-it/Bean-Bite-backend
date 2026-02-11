import { Request, Response } from "express";

import { ERROR_MESSAGES } from "../../constants/errorMessages";

import HttpStatus from "../../constants/httpsStatusCode";
import ICategoryCustomerController from "../../interfaces/controller/customer/category.customer.controller.interface";
import ICategoryCustomerServiceInterface from "../../interfaces/service/customer/category.customer.service.interface";

export class CategoryCustomerController implements ICategoryCustomerController {
  constructor(private _categoryService: ICategoryCustomerServiceInterface) { }

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
      const search = req.query.search as string | undefined;

      const result =await this._categoryService.getAllCategories(page, limit, search);

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

