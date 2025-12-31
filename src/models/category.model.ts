// models/CategoryModel.ts
import mongoose, { Schema } from "mongoose";
import { ICategoryDocument } from "../types/category.type";

const categorySchema = new Schema<ICategoryDocument>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: Boolean, 
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategoryDocument>(
  "Category",
  categorySchema
);
