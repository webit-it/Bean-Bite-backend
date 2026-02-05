import { Types, UpdateQuery } from "mongoose";
import {ICategoryDocument,PaginatedCategories} from "../../types/category.type";

export default interface ICategoryRepository {

  findBySlug(slug: string): Promise<ICategoryDocument | null>;

  findByName(categoryName: string): Promise<ICategoryDocument | null>;

  findBySlugOrName(slug: string, categoryName: string): Promise<ICategoryDocument | null>;

  create(data: Partial<ICategoryDocument>): Promise<ICategoryDocument>;

  update(
    id: string | Types.ObjectId,
    data: UpdateQuery<ICategoryDocument>
  ): Promise<ICategoryDocument | null>;

  findById(id: string): Promise<ICategoryDocument | null>;

  findAll(): Promise<ICategoryDocument[]>;

  findAllPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedCategories<ICategoryDocument>>;

}
