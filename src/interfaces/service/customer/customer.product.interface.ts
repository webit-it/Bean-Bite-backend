import { IProduct } from "../../../types/product.type";

export interface IProductService{
  getProducts(
    page: number,
    limit: number,
    search?: string,
    category?: string
  ): Promise<{
    data: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;   
  
  getProductDetails(slug: string): Promise<IProduct>;
}