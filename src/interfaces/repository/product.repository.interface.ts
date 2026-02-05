import { Types, UpdateQuery } from "mongoose";
import { IProduct, IProductDocument, PaginatedProducts } from "../../types/product.type";


export default interface IProductRepository {
  findBySlug(slug: string): Promise<IProductDocument | null>;
  findByName(productName: string): Promise<IProductDocument | null>;
  findBySlugOrName(slug: string, productName: string): Promise<IProductDocument | null>;
  create(data: Partial<IProductDocument>): Promise<IProductDocument>;
  update(
    id: string | Types.ObjectId,
    data: UpdateQuery<IProductDocument>
  ): Promise<IProductDocument | null>;

  findAll(): Promise<IProductDocument[]>;
  findById(id: string): Promise<IProduct | null>;
  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    category?: string,
    exclude?: string[]
  ): Promise<PaginatedProducts<IProductDocument>>;
}