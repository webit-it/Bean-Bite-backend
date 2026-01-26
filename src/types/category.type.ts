import { Document } from "mongoose";

/* ---------------- SEARCH ---------------- */

export type CategorySearchQuery = {
  $or?: Array<{
    categoryName?: { $regex: string; $options: string };
    slug?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
};

/* ---------------- ENTITY (SERVICE LEVEL) ---------------- */

export interface ICategory {
  categoryName: string;
  image: string;
  slug: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- MONGOOSE DOCUMENT ---------------- */

export interface ICategoryDocument extends Document {
  categoryName: string;
  image: string;
  slug: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- DTOs ---------------- */

export interface CreateCategoryDTO {
  categoryName: string;
  description: string;
  slug: string;
  imageBuffer: Buffer;
  status:boolean;
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

/* ---------------- PAGINATION ---------------- */

// ✅ For repository (documents)
export interface PaginatedCategories<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ✅ For API response (DTOs)
export interface PaginatedCategoryResponse {
  data: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ---------------- RESPONSE DTO ---------------- */

export interface CategoryResponseDto {
  id: string;
  categoryName: string;
  description: string;
  slug: string;
  image: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
