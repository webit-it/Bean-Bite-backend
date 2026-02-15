import { IProductDocument } from "../types/product.type";
import { ICategoryDocument } from "../types/category.type";
import { ICustomerDocument } from "../types/customer.type";

import {
  SearchProduct,
  SearchCategory,
  SearchUser,
  GlobalSearchResult
} from "../types/globalSearch.type";

export class GlobalSearchMapper {
  static toSearchProduct(doc: IProductDocument): SearchProduct {
    return {
      id: doc._id.toString(),
      productName: doc.productName,
      slug: doc.slug,
      price: doc.price,
      finalPrice: doc.finalPrice,
      image: doc.image
    };
  }

  static toSearchCategory(doc: ICategoryDocument): SearchCategory {
    return {
      id: doc._id.toString(),
      categoryName: doc.categoryName,
      slug: doc.slug,
      image: doc.image ?? null
    };
  }

  static toSearchUser(doc: ICustomerDocument): SearchUser {
    return {
      id: doc._id.toString(),
      fullName: doc.fullName,
      phoneNumber: doc.phoneNumber
    };
  }

  static toGlobalSearchResult(
    products: IProductDocument[],
    categories: ICategoryDocument[],
    users: ICustomerDocument[]
  ): GlobalSearchResult {
    return {
      products: products.map(this.toSearchProduct),
      categories: categories.map(this.toSearchCategory),
      users: users.map(this.toSearchUser)
    };
  }
}