import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import IProductRepository from "../../interfaces/repository/product.repository.interface";
import { IProductService } from "../../interfaces/service/customer/customer.product.interface";
import { ProductMapper } from "../../mappers/product.mapper";
import AppError from "../../utils/AppError";

export class ProductService implements IProductService {
  constructor(private _productRepository: IProductRepository) { }
  getProducts = async (
    page: number,
    limit: number,
    search?: string,
    category?: string
  ) => {
    const result = await this._productRepository.findAllPaginated(
      page,
      limit,
      search,
      category
    );

    return {
      data: result.data.map(ProductMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  };

  getProductDetails = async (slug: string) => {
    try {
      const product = await this._productRepository.findBySlug(slug);

      if (!product) {
        throw new AppError(
          Messages.PRODUCT_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      return ProductMapper.toResponse(product);
    } catch (error) {
      console.log("Get category for edit error:", error);
      throw error;
    }
  };
}