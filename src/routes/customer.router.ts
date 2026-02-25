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
import { NotificationRepository } from '../repositories/notification.repository'
import { NotificationService } from '../services/customer/notification.customer'
import { NotificationController } from '../controllers/customer/notification.controller'
const router=express.Router()

const customerAuthRepo=new CustomerAuthRepository()
const customerAuthService=new CustomerAuthService(customerAuthRepo)
const authController=new CustomerAuthController(customerAuthService)

// Register & Login
router.post("/register", authController.register);
router.post("/login", authController.login);

// OTP
router.post("/otp/verify", authController.verifyOtp);
router.post("/otp/resend", authController.resendOtp);

// Forgot / Reset password
router.post("/check-customer", authController.verifyCustomer);
router.post("/reset-password", authController.resetPassword);

// 🔄 Refresh access token
router.post("/refresh-token", authController.refreshAccessToken);

// 🚪 Logout (clears refresh token + cookies)
router.post("/logout", authController.logoutUser);


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


const notificationRepository=new NotificationRepository()
const notificationService=new NotificationService(notificationRepository)
const notificationController=new NotificationController(notificationService)
router.get(
  "/notifications",
  verifyToken,
  notificationController.getMyNotifications.bind(notificationController)
)

router.patch(
  "/notifications/:id/read",
  verifyToken,
  notificationController.markAsRead.bind(notificationController)
)

router.get(
  "/notifications/unread-count",
  verifyToken,
  notificationController.unreadCount.bind(notificationController)
)

export default router 