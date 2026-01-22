import { Types, UpdateQuery } from "mongoose";
import { IProduct, IProductDocument, PaginatedProducts } from "../../types/product.type";


export default interface IProductRepository {
  findBySlug(slug: string): Promise<IProduct | null>;
  findByName(categoryName: string): Promise<IProduct | null>;
  create(data: Partial<IProduct>): Promise<IProduct>;
  update(
    id: string | Types.ObjectId,
    data: UpdateQuery<IProduct>
  ): Promise<IProduct | null>;

  findAll(): Promise<IProductDocument[]>;
  findById(id: string): Promise<IProduct | null>;
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    category?:string,
  ): Promise<PaginatedProducts>;
}