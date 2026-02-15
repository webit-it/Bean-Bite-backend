import mongoose from "mongoose";
import { IProductDocument, ProductResponseDto } from "../types/product.type";

export class ProductMapper {
  static toResponse(doc: IProductDocument): ProductResponseDto {
    const category =doc.category &&
      typeof doc.category === "object" && "slug" in doc.category
        ? {
            id: doc.category._id.toString(),
            slug: doc.category.slug,
          }
        : {
            id: doc.category
              ? doc.category.toString()
              : "",
            slug: "",
          };

    return {
      id: doc._id.toString(),
      productName: doc.productName,
      slug: doc.slug,
      category,
      price: doc.price,
      discountType: doc.discountType,
      discountValue: doc.discountValue,
      description: doc.description,
      finalPrice: doc.finalPrice,
      image: doc.image,
      status: doc.status,
    };
  }
  static toResponseList(
  products: IProductDocument[]
): ProductResponseDto[] {
  return products.map(product => this.toResponse(product));
}
}



export const toProductResponseDtoArray = (
  products: IProductDocument[]
): ProductResponseDto[] => {
  return products.map(ProductMapper.toResponse);
};
