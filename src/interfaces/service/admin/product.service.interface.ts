import { CreateProductDTO, IProduct, PaginatedProductsResponse, ProductResponseDto, UpdateProductDTO } from "../../../types/product.type";

export default interface IProductServiceInteface {
  createProduct(data: CreateProductDTO): Promise<ProductResponseDto>;
  getProductBySlug(slug: string): Promise<ProductResponseDto>;
  updateProduct(id: string, data: UpdateProductDTO): Promise<ProductResponseDto>;

  getAllProducts(
    page: number,
    limit: number,
    search?: string,
    status?:boolean
  ): Promise<{
    data: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

}
