import express from 'express'
import { CustomerAuthRepository } from '../repositories/customer.auth.repository'
import { CustomerAuthService } from '../services/customer/auth.customer.service'
import { CustomerAuthController } from '../controllers/customer/authController'
const router=express.Router()

const customerAuthRepo=new CustomerAuthRepository()
const customerAuthService=new CustomerAuthService(customerAuthRepo)
const authController=new CustomerAuthController(customerAuthService)

router.route("/register").post(authController.register);
router.route("/otp/verify").post(authController.verifyOtp);
router.route("/otp/resend").post(authController.resendOtp);
router.route("/login").post(authController.login);

export default router