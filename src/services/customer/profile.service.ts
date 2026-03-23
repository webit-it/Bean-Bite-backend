import mongoose, { Types } from "mongoose";
import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import { ICustomerAuthRepo } from "../../interfaces/repository/customer.auth.repository.inerface"
import { IProfileService } from "../../interfaces/service/customer/profile.customer.interface";
import { ICustomerRewardProgressRepository } from "../../interfaces/repository/reward.progress.repository.interface";
import { CustomerRewardProgressMapper } from "../../mappers/reward.progress.mapper";


export class ProfileService implements IProfileService {
    constructor(private _customerRepo: ICustomerAuthRepo, private _customerProgress: ICustomerRewardProgressRepository) { }
    getProfile = async (customerId: string) => {
        try {
            const customer = await this._customerRepo.findById(customerId)
            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
            }
            return customer
        } catch (error) {
            console.log("Error get profile", error)
            throw error
        }
    }
    // editProfile = async (customerId: string, fullName: string, phoneNumber?: string) => {
    //     try {
    //         const customer = await this._customerRepo.findById(customerId)
    //         if (!customer) {
    //             throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
    //         }

    //         if (phoneNumber) {
    //             const phoneRegex = /^[6-9]\d{9}$/;

    //             if (!phoneRegex.test(phoneNumber)) {
    //                 throw {
    //                     status: HttpStatus.BAD_REQUEST,
    //                     message: "Invalid phone number",
    //                 };
    //             }
    //         }
    //         const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //         const hashedOtp = await bcrypt.hash(otp, 10);
    //         const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    //         console.log(`OTP for ${phoneNumber}: ${otp}`);
    //         const data = {
    //             fullName,
    //             phoneNumber,
    //             otp: hashedOtp,
    //             otpExpires
    //         }
    //         const updated = await this._customerRepo.update(customerId, data)
    //         if (!updated) {
    //             throw {
    //                 status: HttpStatus.INTERNAL_SERVER_ERROR,
    //                 message: Messages.UPDATE_FAILED,
    //             };
    //         }

    //         return updated
    //     } catch (error) {
    //         console.log("Error edit profile", error)
    //         throw error
    //     }
    // }
    getReward = async (customerId: string) => {
        try {
            const customer = await this._customerRepo.findById(customerId)
            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.CUSTOMER_NOT_FOUND };
            }
            const customerObjectId = new mongoose.Types.ObjectId(customerId);

            const activeProgress =
                await this._customerProgress.getLatestActiveProgress(
                    customerObjectId
                );

            const completedProgressList =
                await this._customerProgress.getCompletedProgress(
                    customerObjectId
                );

            return {
                message: "Customer rewards fetched successfully",
                data: {
                    activeReward: activeProgress
                        ? CustomerRewardProgressMapper.toResponseFromDocument(
                            activeProgress
                        )
                        : null,

                    completedRewards: completedProgressList.length
                        ? completedProgressList.map((progress) =>
                            CustomerRewardProgressMapper.toResponse(progress)
                        )
                        : [],
                },
            };
        } catch (error) {
            console.log("Error get reward", error)
            throw error
        }
    }
    
}