import { Request, Response } from "express";
import IProductController from "../../interfaces/controller/admin/product.controller.interface";
import IProductServiceInteface from "../../interfaces/service/admin/product.service.interface";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AppError from "../../utils/AppError";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";



export class ProductController implements IProductController {
    constructor(private _productService: IProductServiceInteface) { }

    create = async (req: Request, res: Response) => {
        try {
            const { productName, description, slug, category, discountType } = req.body;
            console.log(req.body)
            const price = Number(req.body.price);
            const discountValue = Number(req.body.discountValue);
            if (!productName || !description) {
                throw new AppError(
          Messages.PRODUCT_NAME_AND_DESCRIPTION_REQUIRED,
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
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message:Messages.CREATE_SUCCESS,
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
}