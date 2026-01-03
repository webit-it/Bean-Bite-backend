import { CreateProductDTO, IProduct, PaginatedProductsResponse, UpdateProductDTO } from "../../../types/product.type";

export default interface IProductServiceInteface{
      createProduct(data: CreateProductDTO): Promise<IProduct>;
      getProductForEdit(slug: string): Promise<IProduct>;
        updateProduct(id: string,data: UpdateProductDTO ): Promise<IProduct>;
       getAllProducts(
        page: number,
        limit: number,
        search?: string
      ): Promise<PaginatedProductsResponse>;
}