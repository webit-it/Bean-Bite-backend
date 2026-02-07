import mongoose from "mongoose";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import IProductServiceInteface from "../../interfaces/service/admin/product.service.interface";
import IProductRepository from "../../interfaces/repository/product.repository.interface";
import { CreateProductDTO, IProduct, UpdateProductDTO } from "../../types/product.type";
import { calculateFinalPrice } from "../../utils/calculateFinalPrice";
import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import AppError from "../../utils/AppError";
import { ProductMapper } from "../../mappers/product.mapper";


export class ProductService implements IProductServiceInteface {
  constructor(
    private _productRepository: IProductRepository
  ) { }

  createProduct = async (data: CreateProductDTO) => {

    try {
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

   const productDoc= await this._productRepository.create({
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

   return ProductMapper.toResponse(productDoc);
  
      } catch (error) {
        console.log("Create category error :", error);
        throw error;
      
    }


  }
  getProductBySlug= async (slug: string) => {
    try {
      const productDoc = await this._productRepository.findBySlug(slug);

      if (!productDoc) {
        throw new AppError(
          Messages.PRODUCT_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      return ProductMapper.toResponse(productDoc);
    } catch (error) {
      console.log("Get category for edit error:", error);
      throw error;
    }
  };
  updateProduct = async (id: string, data: UpdateProductDTO) => {
    try {
      if (data.productName) {
        const existingProduct =
          await this._productRepository.findByName(data.productName);

        if (existingProduct && existingProduct.slug !== data.slug) {
          throw new AppError(
            Messages.PRODUCT_AlREADY_EXIST,
            HttpStatus.BAD_REQUEST
          );

        }
      }
      const price = data.price ?? 0;
      const discountType = data.discountType;
      const discountValue = data.discountValue;

      const finalPrice = calculateFinalPrice(
        price,
        discountType,
        discountValue
      );
      const updateData: Partial<IProduct> = {
        productName: data.productName,
        description: data.description,
        status: data.status,
        slug: data.slug,
        category: data.category,
        price: data.price,
        discountType: data.discountType,
        discountValue: data.discountValue,
        finalPrice: finalPrice,
      };

      if (data.image) {
        const imageUrl = await uploadToCloudinary(data.image, "products");
        updateData.image = imageUrl;
      }

      const updatedDoc = await this._productRepository.update(id, updateData);

      if (!updatedDoc) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: Messages.UPDATE_FAILED,
        };
      }

      return ProductMapper.toResponse(updatedDoc);
    } catch (error) {
      console.log("Update category error:", error);
      throw error;
    }
  };
  getAllProducts = async (page: number, limit: number, search?: string) => {
   
  const result = await this._productRepository.findAllPaginated(
  page,
  limit,
  search
);

return {
  data: result.data.map(ProductMapper.toResponse), 
  total: result.total,
  page: result.page,
  limit: result.limit,
  totalPages: Math.ceil(result.total / limit),
};

  };

}
