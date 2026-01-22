import mongoose, { HydratedDocument } from "mongoose";

export interface IProduct {
  productName: string;
  slug: string;
  category: mongoose.Types.ObjectId;
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


export interface CreateProductDTO {
  productName: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: Buffer;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
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
export interface PaginatedProducts {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedProductsResponse {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

