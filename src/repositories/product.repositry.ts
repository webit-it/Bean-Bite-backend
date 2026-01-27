import mongoose from "mongoose";
import IProductRepository from "../interfaces/repository/product.repository.interface";
import ProductModel from "../models/product.model";
import { IProductDocument, ProductSearchQuery } from "../types/product.type";
import { BaseRepository } from "./base.reposiory";

export class ProductRepository
  extends BaseRepository<IProductDocument>
  implements IProductRepository {

  constructor() {
    super(ProductModel);
  }

  findBySlug(slug: string) {
    return this.model.findOne({ slug }).exec();
  }

  findByName(productName: string) {
    return this.model.findOne({ productName }).exec();
  }

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    category?: string
  ) {
    const skip = (page - 1) * limit;
    const query: ProductSearchQuery = {};

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return { data: [], total: 0, page, limit };
      }
      query.category = new mongoose.Types.ObjectId(category);
    }



    const [data, total] = await Promise.all([
  this.model
    .find(query)
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit),

  this.model.countDocuments(query),
]);

    return { data, total, page, limit };
  }
}
