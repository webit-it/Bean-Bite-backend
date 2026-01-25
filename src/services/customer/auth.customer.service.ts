import bcrypt from "bcrypt"
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { ICustomerAuthService } from "../../interfaces/service/customer/auth.customer.interface";
import { ICustomerAuthRepo } from "../../interfaces/repository/customer.auth.repository.inerface";
export class CustomerAuthService implements ICustomerAuthService {
    constructor(private _customerRepo: ICustomerAuthRepo) { }

    register = async (fullName: string, phoneNumber: string, password: string) => {
        try {
            const existingCustomer=await this._customerRepo.findByphoneNumber(phoneNumber)
            if(existingCustomer){
                throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_AlREADY_EXIST };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            console.log(`OTP for ${phoneNumber}: ${otp}`);
            const data = {
                fullName,
                phoneNumber,
                password: hashedPassword, 
                isActive:true,
                isAdmin: false,
                otp: hashedOtp,
                otpExpires
            }
            const customer = await this._customerRepo.create(data)

            const token = await generateToken(customer._id.toString(), customer.isAdmin)
            const refreshToken = generateRefreshToken(customer._id.toString(), customer.isAdmin);
            return { customer, token, refreshToken }
        } catch (error) {
            console.log("Error in register :", error)
            throw error
        }
    }

    async verifyOtp(phoneNumber: string, otp: string) {
        const customer = await this._customerRepo.findByphoneNumber(phoneNumber);

        if (!customer) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.CUSTOMER_NOT_FOUND };
        }


        if (!customer.otp ||!customer.otpExpires ||Date.now() > customer.otpExpires.getTime()){
            throw {status: HttpStatus.BAD_REQUEST,message: Messages.INVALID_OTP}}


        const isMatch = await bcrypt.compare(otp.trim(), customer.otp);
        if (!isMatch) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVALID_OTP };
        }

        customer.otp = null;
        customer.otpExpires = null;

        await this._customerRepo.saveCustomer(customer);
        return {
            customer,
            message: "OTP verified successfully",
        };
    }
    async resendOtp(phoneNumber: string): Promise<string> {
        const customer = await this._customerRepo.findByphoneNumber(phoneNumber);

        if (!customer) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(newOtp, 10);
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

        customer.otp = hashedOtp;
        customer.otpExpires = otpExpires;
        await this._customerRepo.saveCustomer(customer);

        // sendVerificationEmail(email, newOtp);
        console.log(`New OTP for ${phoneNumber}: ${newOtp}`);
        return "OTP resent successfully";
    }
    async Login(phoneNumber: string, password: string) {

        const user = await this._customerRepo.findByphoneNumber(phoneNumber);

        if (!user) {
            throw { status: HttpStatus.NOT_FOUND, message:Messages.CUSTOMER_NOT_FOUND };
        }

        if (!user.password) {
            throw { status: HttpStatus.BAD_REQUEST, message: "Password is missing for this user" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: HttpStatus.UNAUTHORIZED, message: Messages.PASSWORD_DO_NOT_MATCH };
        }

        const id = typeof user._id === "string" ? user._id : String(user._id);
        const token = generateToken(id, user.isAdmin);
        const refreshToken = generateRefreshToken(id, user.isAdmin);

        return {
            user,
            token,
            refreshToken,
        };
    }
    verifyCustomer = async (phoneNumber: string) => {
        try {
            const customer = await this._customerRepo.findByphoneNumber(phoneNumber);

            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("otp :", otp);
            const hashedOtp = await bcrypt.hash(otp, 10);
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            customer.otp = hashedOtp;
            customer.otpExpires = otpExpires;

            await this._customerRepo.saveCustomer(customer);

            return customer;
        } catch (error) {
            console.log("Error in customer forgot password", error);
            throw error;
        }
    };
}