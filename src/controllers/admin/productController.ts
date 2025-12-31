import { Request, Response } from "express";
import IProductController from "../../interfaces/controller/admin/product.controller.interface";
import IProductServiceInteface from "../../interfaces/service/admin/product.service.interface";
import { ERROR_MESSAGES } from "../../constants/errorMessages";



export class ProductController implements IProductController {
    constructor(private _productService: IProductServiceInteface) { }

    create = async (req: Request, res: Response) => {
        try {
            const { productName, description, slug, price, category } = req.body;
            console.log(req.file)

            if (!productName || !description) {
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

            await this._productService.createProduct({
                productName,
                slug,
                category,
                price,
                description,
                image: req.file.buffer,
            });

            res.status(201).json({
                success: true,
                message: "product created successfully",
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