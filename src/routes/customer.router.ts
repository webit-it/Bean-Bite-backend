import express from 'express'
import { CustomerAuthRepository } from '../repositories/customer.auth.repository'
import { CustomerAuthService } from '../services/customer/auth.customer.service'
import { ProductService } from '../services/customer/product.service'
import { ProductRepository } from '../repositories/product.repositry'
import { ProductController } from '../controllers/customer/product.controller'
import { ProfileService } from '../services/customer/profile.service'
import { ProfileController } from '../controllers/customer/profile.controller'
import { CustomerAuthController } from '../controllers/customer/authController'
import { verifyToken } from '../middleware/auth.middleware'
import { CategoryRepository } from '../repositories/category.repository'
import { CategoryCustomerService } from '../services/customer/category.customer.service'
import { CategoryCustomerController } from '../controllers/customer/category.controller'
const router=express.Router()

const customerAuthRepo=new CustomerAuthRepository()
const customerAuthService=new CustomerAuthService(customerAuthRepo)
const authController=new CustomerAuthController(customerAuthService)
router.route("/register").post(authController.register);
router.route("/otp/verify").post(authController.verifyOtp);
router.route("/otp/resend").post(authController.resendOtp);
router.post("/check-customer", authController.verifyCustomer);
router.post("/reset-password", authController.resetPassword);
router.route("/login").post(authController.login);



const productRepo=new ProductRepository()
const productService=new ProductService(productRepo)
const productController=new ProductController(productService)
router.get("/product/:slug", productController.getProductDetails);
router.get("/product", productController.getProducts);
router.get('/product/related/:slug',productController.relatedProducts)
   


const profileService=new ProfileService(customerAuthRepo)
const profileController=new ProfileController(profileService)
router
  .route("/profile")
  .get(verifyToken, profileController.getProfile)

  

const categoryRepo=new CategoryRepository()
const categoryCustomerService=new CategoryCustomerService(categoryRepo)
const categoryCustomerController=new CategoryCustomerController(categoryCustomerService)
router.get('/category',categoryCustomerController.getAllCategories)


export default router 