import mongoose, { HydratedDocument, Types } from "mongoose";
import { CategoryMiniDto, ICategoryPopulated } from "./category.type";

export type ProductSearchQuery = {
  $or?: Array<{
    productName?: { $regex: string; $options: string };
    slug?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
  category?: mongoose.Types.ObjectId;
};

export interface IProduct {
  productName: string;
  slug: string;
  category: Types.ObjectId | ICategoryPopulated;
  price: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  description: string;
  finalPrice: number;
  image: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IProductDocument = HydratedDocument<IProduct>; 
 


export interface ProductResponseDto {
  id: string;
  productName: string;
  slug: string;
  category:CategoryMiniDto;
  price: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  description: string;
  finalPrice: number;
  image: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}



export interface CreateProductDTO {
  productName: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: Buffer;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  status: boolean;
}

export interface UpdateProductDTO {
  productName?: string;
  slug?: string;
  description?: string;
  category?: mongoose.Types.ObjectId;
  price?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  finalPrice?: number;
  image?: Buffer;
  status?: boolean;
}

export interface GetProductsDTO {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}
export interface PaginatedProducts<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedProductsResponse {
  data: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



