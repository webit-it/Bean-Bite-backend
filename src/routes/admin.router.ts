import { Router } from "express";
import { upload } from "../config/multer";

import { CategoryRepository } from "../repositories/category.repository";
import { ProductController } from "../controllers/admin/productController";
import { ProductService } from "../services/admin/product.service";
import { ProductRepository } from "../repositories/product.repositry";
import { CategoryController } from "../controllers/admin/categoryController";
import { CategoryService } from "../services/admin/category.service";
const router = Router();

const categoryRepository= new CategoryRepository()
const categoryService= new CategoryService(categoryRepository)
const categoryController=new CategoryController(categoryService)


const productRepository= new ProductRepository()
const productService=new ProductService(productRepository)
const productController=new ProductController(productService)


router.post(
  "/category",
  upload.single("image"),
  categoryController.create.bind(categoryController)
);
router.get("/category/:slug", categoryController.getCategoryBySlug);
router.get("/category", categoryController.getAllCategories);
router.put(
  "/category/:id",
  upload.single("image"),
  categoryController.editCategory
);
router.patch(
  "/category/:id/status/change",
  categoryController.toggleCategoryStatus
);

router.post(
  "/product",
  upload.single("image"),
  productController.create.bind(productController)
);
export default router;