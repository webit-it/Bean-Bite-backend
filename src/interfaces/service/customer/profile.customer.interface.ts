import { ICustomer } from "../../../types/customer.type";
import { CustomerRewardProgressResponseDto } from "../../../types/customerRewardProgress.type";

export interface IProfileService {
    getProfile(phoneNumber: string): Promise<ICustomer>
    getReward(customerId: string): Promise<IGetCustomerRewardResponse>
    // editProfile(customerId: string, fullName: string, phoneNumber?: string):Promise<ICustomerDocument>
}

export interface IGetCustomerRewardResponse {
    message: string;
    data: {
        activeReward: CustomerRewardProgressResponseDto | null;
        completedRewards: CustomerRewardProgressResponseDto[];
    };
}
