import { CategoryResponseDto, ICategoryDocument } from "../types/category.type";

export class CategoryMapper {
  static toResponse(doc: ICategoryDocument): CategoryResponseDto {
    return {
      id: doc._id.toString(),
      categoryName: doc.categoryName,
      description: doc.description,
      slug: doc.slug,
      image: doc.image,
      status: doc.status,

    };
  }
}

export const toCategoryResponseDtoArray = (
  categories: ICategoryDocument[]
): CategoryResponseDto[] => {
  return categories.map(CategoryMapper.toResponse);
};
