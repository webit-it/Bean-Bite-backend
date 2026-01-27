import { IProductDocument, ProductResponseDto } from "../types/product.type";

export class ProductMapper {
  static toResponse(doc: IProductDocument): ProductResponseDto {
    return {
      id: doc._id.toString(),
      productName: doc.productName,
      slug: doc.slug,
      category: doc.category,
      price: doc.price,
      discountType: doc.discountType,
      discountValue: doc.discountValue,
      description: doc.description,
      finalPrice: doc.finalPrice,
      image: doc.image,
      status: doc.status,

    };
  }
}

export const toProductResponseDtoArray = (
  products: IProductDocument[]
): ProductResponseDto[] => {
  return products.map(ProductMapper.toResponse);
};
