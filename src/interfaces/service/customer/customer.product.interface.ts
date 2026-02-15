import { IProduct, ProductResponseDto } from "../../../types/product.type";

export interface IProductService{
  getProducts(
    page: number,
    limit: number,
    search?: string,
    category?: string
  ): Promise<{
    data:  ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;   
  
  getProductDetails(slug: string): Promise<ProductResponseDto>;
  getRelatedProducts(slug:string): Promise<ProductResponseDto[]>; 
}