import mongoose from "mongoose";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import IProductServiceInteface from "../../interfaces/service/admin/product.service.interface";
import IProductRepository from "../../interfaces/repository/product.repository.interface";
import { CreateProductDTO } from "../../types/product.type";
import { calculateFinalPrice } from "../../utils/calculateFinalPrice";
import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import AppError from "../../utils/AppError";


export class ProductService implements IProductServiceInteface {
  constructor(
    private _productRepository: IProductRepository
  ) { }

  createProduct = async (data: CreateProductDTO) => {
    const {
      productName,
      description,
      slug,
      image,
      category,
      price,
      discountType,
      discountValue,
    } = data;
    const existing = await this._productRepository.findBySlug(slug);
    if (existing) {
      throw new AppError(
        Messages.PRODUCT_AlREADY_EXIST,
        HttpStatus.NOT_FOUND
      );
    }
    const imageUrl = await uploadToCloudinary(image, "products");

    const finalPrice = calculateFinalPrice(
      price,
      discountType,
      discountValue
    );

    return this._productRepository.create({
      productName,
      slug,
      category: new mongoose.Types.ObjectId(category),
      price,
      finalPrice,
      description,
      image: imageUrl,
      discountType,
      discountValue,
      status: true,
    });
  }
}
