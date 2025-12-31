import { CreateProductDTO, IProduct } from "../../../types/product.type";

export default interface IProductServiceInteface{
      createProduct(data: CreateProductDTO): Promise<IProduct>;
}