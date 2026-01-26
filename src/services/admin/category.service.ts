import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import ICategoryRepository from "../../interfaces/repository/category.repostory.interface";
import ICategoryServiceInterface from "../../interfaces/service/admin/category.service.interface";
import { CategoryMapper } from "../../mappers/category.mapper";
import { CategoryResponseDto, CreateCategoryDTO, ICategory, PaginatedCategoryResponse, UpdateCategoryDTO } from "../../types/category.type";
import AppError from "../../utils/AppError";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export class CategoryService implements ICategoryServiceInterface {
  constructor(
    private _categoryRepository: ICategoryRepository
  ) { }

  createCategory = async (
    data: CreateCategoryDTO
  ): Promise<CategoryResponseDto> => {
    try {
      const { categoryName, description, slug, imageBuffer,status } = data;

      const existing = await this._categoryRepository.findBySlug(slug);
      if (existing) {
        throw new AppError(
          Messages.CATEGORY_AlREADY_EXIST,
          HttpStatus.NOT_FOUND
        );
      }

      const imageUrl = await uploadToCloudinary(imageBuffer, "categories");

      const categoryDoc = await this._categoryRepository.create({
        categoryName,
        description,
        slug,
        image: imageUrl,
        status
      });

      return CategoryMapper.toResponse(categoryDoc);

    } catch (error) {
      console.log("Create category error :", error);
      throw error;
    }
  };
 getCategoryBySlug = async (slug: string): Promise<CategoryResponseDto> => {
  try {
    const categoryDoc = await this._categoryRepository.findBySlug(slug);

    if (!categoryDoc) {
      throw new AppError(
        Messages.CATEGORY_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return CategoryMapper.toResponse(categoryDoc);

  } catch (error) {
    console.log("Get category for edit error:", error);
    throw error;
  }
};

updateCategory = async (
  id: string,
  data: UpdateCategoryDTO
): Promise<CategoryResponseDto> => {
  try {
    if (data.categoryName) {
      const existingCategory =
        await this._categoryRepository.findByName(data.categoryName);

      if (existingCategory && existingCategory._id.toString() !== id) {
        throw new AppError(
          Messages.CATEGORY_AlREADY_EXIST,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const updateData: Partial<ICategory> = {
      categoryName: data.categoryName,
      description: data.description,
      status: data.status,
      slug: data.slug,
    };

    if (data.imageBuffer) {
      const imageUrl = await uploadToCloudinary(
        data.imageBuffer,
        "categories"
      );
      updateData.image = imageUrl;
    }

    const updatedDoc = await this._categoryRepository.update(id, updateData);

    if (!updatedDoc) {
      throw new AppError(
        Messages.UPDATE_FAILED,
        HttpStatus.NOT_FOUND
      );
    }

    // ✅ map DB document → response DTO
    return CategoryMapper.toResponse(updatedDoc);

  } catch (error) {
    console.log("Update category error:", error);
    throw error;
  }
};


 getAllCategories = async (
  page: number,
  limit: number,
  search?: string
): Promise<PaginatedCategoryResponse> => {

  const result =
    await this._categoryRepository.findAllPaginated(page, limit, search);

  return {
    data: result.data.map(CategoryMapper.toResponse), 
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
  };
};


}
