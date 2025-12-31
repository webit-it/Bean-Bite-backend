import { Types, UpdateQuery } from "mongoose";
import { ICategory, ICategoryDocument, PaginatedCategories } from "../../types/category.type";


export default interface ICategoryRepository {
    findBySlug(slug: string): Promise<ICategory | null>;
    findByName(categoryName: string): Promise<ICategory | null>;
    create(data: Partial<ICategory>): Promise<ICategory>;
    update(
        id: string | Types.ObjectId,
        data: UpdateQuery<ICategory>
    ): Promise<ICategory | null>;

    findAll(): Promise<ICategoryDocument[]>;
    findById(id: string): Promise<ICategory | null>;
    findAllPaginated(
        page: number,
        limit: number,
        search?: string
    ): Promise<PaginatedCategories>;

}
