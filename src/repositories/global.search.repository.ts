import { ISearchRepository } from "../interfaces/repository/global.search.repository.interface";
import { GlobalSearchResult } from "../types/globalSearch.type";

import Product from "../models/product.model";
import Category from "../models/category.model";
import { Customer } from "../models/customer.model";

import { GlobalSearchMapper } from "../mappers/globalSearch.mapper";

export class SearchRepository implements ISearchRepository {
  async globalSearch(query: string): Promise<GlobalSearchResult> {
    const regex = new RegExp(query, "i");

    const [products, categories, users] = await Promise.all([
      Product.find(
        {
          $or: [{ productName: regex }, { slug: regex }],
          status: true
        },
        {
          productName: 1,
          slug: 1,
          price: 1,
          finalPrice: 1,
          image: 1
        }
      ).limit(5),

      Category.find(
        {
          categoryName: regex,
          status: true
        },
        {
          categoryName: 1,
          slug: 1,
          image: 1
        }
      ).limit(5),

      Customer.find(
        {
          fullName: regex,
          isActive: true
        },
        {
          fullName: 1,
          phoneNumber: 1
        }
      ).limit(5)
    ]);

    return GlobalSearchMapper.toGlobalSearchResult(
      products,
      categories,
      users
    );
  }
}