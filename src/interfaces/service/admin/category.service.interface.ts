import { CategoryResponseDto, CreateCategoryDTO, PaginatedCategoryResponse, UpdateCategoryDTO } from "../../../types/category.type";

export default interface ICategoryServiceInterface {

  createCategory(
    data: CreateCategoryDTO
  ): Promise<CategoryResponseDto>;

  getCategoryBySlug(
    slug: string
  ): Promise<CategoryResponseDto>;

  updateCategory(
    id: string,
    data: UpdateCategoryDTO
  ): Promise<CategoryResponseDto>;

  getAllCategories(
    page: number,
    limit: number,
    search?: string,
    status?:boolean
  ): Promise<PaginatedCategoryResponse>;

}
