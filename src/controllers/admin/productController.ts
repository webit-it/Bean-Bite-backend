import { Request, Response } from "express";
import IProductController from "../../interfaces/controller/admin/product.controller.interface";
import IProductServiceInteface from "../../interfaces/service/admin/product.service.interface";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AppError from "../../utils/AppError";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { Types } from "mongoose";



export class ProductController implements IProductController {
  constructor(private _productService: IProductServiceInteface) { }

  create = async (req: Request, res: Response) => {
    try {
      const { productName, description, slug, category, discountType,status } = req.body;
      const price = Number(req.body.price);
      const discountValue = Number(req.body.discountValue);
      if (!productName || !description||!slug) {
        throw new AppError(
          Messages.MISSING_FIELDS,
          HttpStatus.BAD_REQUEST
        );
      }
      if (discountType === "percentage" && discountValue > 100) {
        throw new AppError(
          Messages.PRODUCT_DISCOUNT_PERCENTAGE_LESS_THAN_100,
          HttpStatus.BAD_REQUEST
        );
      }

      if (discountType === "fixed" && discountValue > price) {
        throw new AppError(
          Messages.PRODUCT_FIXED_AMOUNT_LESS_THAN_PRICE,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!req.file) {
        throw new AppError(
          Messages.IMAGE_REQUIRED,
          HttpStatus.BAD_REQUEST
        );
      }

      await this._productService.createProduct({
        productName,
        slug,
        category,
        price,
        discountType,
        discountValue,
        description,
        image: req.file.buffer,
        status
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: Messages.CREATE_SUCCESS,
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
  getProductBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const product = await this._productService.getProductBySlug(slug);

      res.status(HttpStatus.OK).json({
        success: true,
        data: product,
      });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
  editProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { productName,
        slug,
        category,
        discountType,
        description,
        status
      } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(
          Messages.INVALID_PRODUCT_ID,
          HttpStatus.BAD_REQUEST
        );
      }
      const price = Number(req.body.price);
      const discountValue = Number(req.body.discountValue);
      if (!productName || !description||!slug) {
        throw new AppError(
          Messages.MISSING_FIELDS,
          HttpStatus.BAD_REQUEST
        );
      }
      if (discountType === "percentage" && discountValue > 100) {
        throw new AppError(
          Messages.PRODUCT_DISCOUNT_PERCENTAGE_LESS_THAN_100,
          HttpStatus.BAD_REQUEST
        );
      }

      if (discountType === "fixed" && discountValue > price) {
        throw new AppError(
          Messages.PRODUCT_FIXED_AMOUNT_LESS_THAN_PRICE,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!req.file) {
        throw new AppError(
          Messages.IMAGE_REQUIRED,
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedData: any = {
        productName,
        slug,
        category,
        price,
        discountType,
        discountValue,
        description,
        status
      };

      if (req.file) {
        updatedData.imageBuffer = req.file.buffer;
      }

      await this._productService.updateProduct(id, updatedData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.PRODUCT_UPDATED_SUCCESSFULLY,
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
  getAllProducts = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
      const search = req.query.search as string | undefined;

      const result =
        await this._productService.getAllProducts(page, limit, search);

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
      console.log("Get all product controller error:", error);

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