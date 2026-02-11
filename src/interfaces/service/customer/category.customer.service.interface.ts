import { PaginatedCategoryResponse } from "../../../types/category.type";

export default interface ICategoryCustomerServiceInterface {
getAllCategories(page: number,limit: number,search?: string): Promise<PaginatedCategoryResponse>;
}
