import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import ICategoryRepository from "../../interfaces/repository/category.repostory.interface";
import ICategoryServiceInterface from "../../interfaces/service/admin/category.service.interface";
import { CreateCategoryDTO, ICategory, UpdateCategoryDTO } from "../../types/category.type";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export class CategoryService implements ICategoryServiceInterface {
  constructor(
    private _categoryRepository: ICategoryRepository
  ) { }

  createCategory = async (data: CreateCategoryDTO) => {
    try {
      const { categoryName, description, slug, imageBuffer } = data;

      const existing = await this._categoryRepository.findBySlug(slug);
      if (existing) {
        throw { status: HttpStatus.NOT_FOUND, message: Messages.CATEGORY_AlREADY_EXIST };
      }

      const imageUrl = await uploadToCloudinary(imageBuffer, "categories");

      return this._categoryRepository.create({
        categoryName,
        description,
        slug,
        image: imageUrl,
        status: true,
      });
    } catch (error) {
      console.log("Create category error :", error)
      throw error
    }
  }
  getCategoryForEdit = async (slug: string) => {
    try {
      const category = await this._categoryRepository.findBySlug(slug);

      if (!category) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: Messages.CATEGORY_NOT_FOUND,
        };
      }

      return category;
    } catch (error) {
      console.log("Get category for edit error:", error);
      throw error;
    }
  };

  updateCategory = async (id: string, data: UpdateCategoryDTO) => {
    try {
      if (data.categoryName) {
        const existingCategory =
          await this._categoryRepository.findByName(data.categoryName);

        if (existingCategory && existingCategory.slug !== data.slug) {
          throw {
            status: HttpStatus.BAD_REQUEST,
            message: Messages.CATEGORY_AlREADY_EXIST,
          };
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

      const updated = await this._categoryRepository.update(id, updateData);

      if (!updated) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: Messages.UPDATE_FAILED,
        };
      }

      return updated;
    } catch (error) {
      console.log("Update category error:", error);
      throw error;
    }
  };

  // getAllCategories = async (
  //   page: number,
  //   limit: number,
  //   search?: string
  // ) => {
  //   try {
  //     const result = await this._categoryRepository.findAllPaginated(
  //       page,
  //       limit,
  //       search
  //     );
  //     console.log(result,"data from srvice")

  //     return {
  //       data: result.data,
  //       total: result.total,
  //       page: result.page,
  //       limit: result.limit, 
  //       totalPages: Math.ceil(result.total / result.limit),
  //     };
  //   } catch (error) {
  //     console.log("Get all categories error:", error);
  //     throw error;
  //   }
  // };
  getAllCategories = async (page: number,limit: number,search?: string) => {
    const result = await this._categoryRepository.findAllPaginated(page,limit,search);
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    };
  };

  toggleCategoryStatus = async (id: string) => {
    try {
      const category = await this._categoryRepository.findById(id);

      if (!category) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: Messages.CATEGORY_NOT_FOUND,
        };
      }

      const updated = await this._categoryRepository.update(id, {
        status: !category.status,
      });

      if (!updated) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: Messages.UPDATE_FAILED,
        };
      }

      return updated;
    } catch (error) {
      console.log("Toggle category status error:", error);
      throw error;
    }
  };
}
