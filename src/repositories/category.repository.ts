import ICategoryRepository from "../interfaces/repository/category.repostory.interface";
import CategoryModel from "../models/category.model";
import { CategorySearchQuery, ICategoryDocument } from "../types/category.type";
import { BaseRepository } from "./base.reposiory";
import mongoose from "mongoose";


export class CategoryRepository extends BaseRepository<ICategoryDocument> implements ICategoryRepository {
  constructor() {
    super(CategoryModel);
  }

async  findBySlug(slug: string) {
    return await this.model.findOne({ slug }).exec();
  }
async  findByName(categoryName: string) {
    return await this.model.findOne({ categoryName }).exec();
  }
  async findBySlugOrName(slug: string, categoryName: string) {
  return await this.model.findOne({
    $or: [{ slug }, { categoryName }],
  });
}
  async findAllPaginated(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const query: CategorySearchQuery = {};

    if (search) {
      query.$or = [
        { categoryName: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const [data, total] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query)
    ]);
    return {
      data,
      total,
      page,
      limit
    };
  }

}
