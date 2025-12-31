import { Document } from "mongoose";
export type CategorySearchQuery = {
  $or?: Array<{
    categoryName?: { $regex: string; $options: string };
    slug?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
};


export interface ICategory  {
    categoryName: string;
    image: string;
    slug: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICategoryDocument extends Document {
    categoryName: string;
    image: string 
    slug: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCategoryDTO {
  categoryName: string;
  description: string;
  slug:string;
  imageBuffer: Buffer;
}
export interface UpdateCategoryDTO {
  categoryName?: string;
  description?: string;
  status?: boolean;
  slug?: string;
  imageBuffer?: Buffer;
}
export interface UpdateCategoryStatusDTO {
  status: boolean;
}
export interface PaginatedCategories {
  data: ICategory[]; 
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedCategoryResponse {
  data: ICategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
