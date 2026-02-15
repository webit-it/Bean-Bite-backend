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
import { CustomerService } from "../services/admin/customer.service";
import { CustomerController } from "../controllers/admin/customerController";
import { RewardRepository } from "../repositories/reward.repository";
import { RewardService } from "../services/admin/reward.service";
import { RewardController } from "../controllers/admin/rewardController";
import adminOnly from "../middleware/admin.middleware";
import { SearchRepository } from "../repositories/global.search.repository";
import { GlobalSearchService } from "../services/admin/globalSearch.service";
import { GlobalSearchController } from "../controllers/admin/globalSearchController";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router();

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)
const categoryController = new CategoryController(categoryService)

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

const productRepository = new ProductRepository()
const productService = new ProductService(productRepository)
const productController = new ProductController(productService)
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

const adminAuthRepository = new CustomerAuthRepository()
const adminAuthService = new AdminAuthService(adminAuthRepository)
const adminAuthController = new AdminAuthController(adminAuthService)
router.route("/login").post(adminAuthController.login);
router.route("/logout").post(adminAuthController.logout);

const rewardRepo = new RewardRepository()
const rewardService = new RewardService(rewardRepo)
const rewardController = new RewardController(rewardService)

router.route("/reward/:level").get(rewardController.getRewardByLevel).put(rewardController.updateRewardByLevel);
router.route("/reward").get(rewardController.getRewards).post(rewardController.addReward)

const customerRepository = new CustomerAuthRepository()
const customerService = new CustomerService(customerRepository)
const customerController = new CustomerController(customerService)
router.get("/customer", customerController.getAllUsers);
router.patch(
  "/customer/:id/status/change",
  customerController.toggleCustomerStatus
);
router.get(
  "/auth-check",
  verifyToken,
  adminOnly,
  adminAuthController.checkAdminAuth
);


const globalSearchRepository=new SearchRepository()
const globalSerachService=new GlobalSearchService(globalSearchRepository)
const globalSearchController=new GlobalSearchController(globalSerachService)
router.get("/global", globalSearchController.globalSearch);


export default router;