import { Types } from "mongoose";
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

 createCategory = async (data: CreateCategoryDTO) => {
  try {
    const { categoryName, description, slug, imageBuffer, status } = data;

     if (!categoryName || !description || !slug) {
      throw new AppError(
        Messages.MISSING_FIELDS,
        HttpStatus.BAD_REQUEST
      );
    }
    const existing = await this._categoryRepository.findBySlugOrName(slug,categoryName);

    if (existing) {
      throw new AppError(
        Messages.CATEGORY_AlREADY_EXIST,
        HttpStatus.BAD_REQUEST
      );
    }
    const imageUrl = await uploadToCloudinary(
      imageBuffer,
      "categories"
    );

    const categoryDoc = await this._categoryRepository.create({
      categoryName,
      description,
      slug,
      image: imageUrl,
      status,
    });

    return CategoryMapper.toResponse(categoryDoc);

  } catch (error) {
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
    throw error;
  }
};

updateCategory = async (  id: string,  data: UpdateCategoryDTO) => {
  try {
    const { categoryName, description, slug, imageBuffer, status } = data;

     if (!categoryName || !description || !slug) {
        throw new AppError(
          Messages.MISSING_FIELDS,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(
          Messages.INVALID_CATEGORY_ID,
          HttpStatus.BAD_REQUEST
        );
      }

  
      const existing = await this._categoryRepository.findBySlugOrName(slug,categoryName);

      if (existing&&existing._id.toString() !== id) {
        throw new AppError(
          Messages.CATEGORY_AlREADY_EXIST,
          HttpStatus.BAD_REQUEST
        );
    
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

    const updatedDoc =await this._categoryRepository.update(id, updateData);

    if (!updatedDoc) {
      throw new AppError(
        Messages.UPDATE_FAILED,
        HttpStatus.NOT_FOUND
      );
    }

    return CategoryMapper.toResponse(updatedDoc);

  } catch (error) {
    throw error;
  }
};

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
