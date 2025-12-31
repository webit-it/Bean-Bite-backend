import { CreateCategoryDTO, UpdateCategoryDTO, ICategory, UpdateCategoryStatusDTO, PaginatedCategories, PaginatedCategoryResponse } from "../../../types/category.type";

export default interface ICategoryServiceInterface {
  createCategory(data: CreateCategoryDTO): Promise<ICategory>;
  getCategoryForEdit(slug: string): Promise<ICategory>;
  updateCategory(id: string,data: UpdateCategoryDTO ): Promise<ICategory>;
getAllCategories(
  page: number,
  limit: number,
  search?: string
): Promise<PaginatedCategoryResponse>;
toggleCategoryStatus(id: string): Promise<ICategory>;
}
