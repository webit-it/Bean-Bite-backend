import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import HttpStatus from "../../constants/httpsStatusCode";
import { IProductService } from "../../interfaces/service/customer/customer.product.interface";
import mongoose from "mongoose";

export class ProductController {
    constructor(private _productService: IProductService) { }
    getProducts = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 6;
            const search = req.query.search as string | undefined;
            const category = req.query.category as string | undefined;

            if (category && !mongoose.Types.ObjectId.isValid(category)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid category id",
                });
            }

            const result = await this._productService.getProducts(
                page,
                limit,
                search,
                category
            );

            if (category && result.data.length === 0) {
                return res.status(HttpStatus.OK).json({
                    success: true,
                    data: [],
                    message: "This category is empty",
                    pagination: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 0,
                    },
                });
            }

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
    getProductDetails = async (req: Request, res: Response) => {
        try {
            const { slug } = req.params;
            const product = await this._productService.getProductDetails(slug);
            res.status(HttpStatus.OK).json({
                success: true,
                product,
            });
        } catch (error: unknown) {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
            });
        }
    };
    relatedProducts=async (req: Request, res: Response) => {
        try {
            const {slug}=req.params
             const result = await this._productService.getRelatedProducts(slug);
             console.log(result)
            res.status(HttpStatus.OK).json({
                success: true,
                data:result
            });
        } catch (error:unknown) {
            
        }
    }
}