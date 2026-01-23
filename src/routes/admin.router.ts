import { Router } from "express";
import { upload } from "../config/multer";

import { CategoryRepository } from "../repositories/category.repository";
import { ProductController } from "../controllers/admin/productController";
import { ProductService } from "../services/admin/product.service";
import { ProductRepository } from "../repositories/product.repositry";
import { CategoryController } from "../controllers/admin/categoryController";
import { CategoryService } from "../services/admin/category.service";
import { CustomerAuthRepository } from "../repositories/customer.auth.repository";
import { AdminAuthService } from "../services/admin/auth.admin.service";
import { AdminAuthController } from "../controllers/admin/authController";
const router = Router();

const categoryRepository= new CategoryRepository()
const categoryService= new CategoryService(categoryRepository)
const categoryController=new CategoryController(categoryService)


const productRepository= new ProductRepository()
const productService=new ProductService(productRepository)
const productController=new ProductController(productService)

const adminAuthRepository=new CustomerAuthRepository()
const adminAuthService=new AdminAuthService(adminAuthRepository)
const adminAuthController=new AdminAuthController(adminAuthService)
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
router.get("/product/:slug", productController.getProductBySlug);
router.put(
  "/product/:id",
  upload.single("image"),
  productController.editProduct 
);
router.get("/product", productController.getAllProducts);
router.patch(
  "/product/:id/status/change",
  productController.toggleProductStatus
);

router.route("/login").post(adminAuthController.login);

export default router;