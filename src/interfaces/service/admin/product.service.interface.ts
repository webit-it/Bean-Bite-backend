import { CreateProductDTO, IProduct, UpdateProductDTO } from "../../../types/product.type";

export default interface IProductServiceInteface{
      createProduct(data: CreateProductDTO): Promise<IProduct>;
      getProductForEdit(slug: string): Promise<IProduct>;
        updateProduct(id: string,data: UpdateProductDTO ): Promise<IProduct>;
      
}