
import ICategoryRepository from "../../interfaces/repository/category.repostory.interface";
import { CategoryMapper } from "../../mappers/category.mapper";
import ICategoryCustomerServiceInterface from "../../interfaces/service/customer/category.customer.service.interface";


export class CategoryCustomerService implements ICategoryCustomerServiceInterface {
  constructor(
    private _categoryRepository: ICategoryRepository
  ) { }

   getAllCategories = async (
   page: number,
   limit: number,
   search?: string
  ) => {

  const result =await this._categoryRepository.findAllPaginated(page, limit, search);

  return {
    data: result.data.map(CategoryMapper.toResponse), 
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
  };
};


}
