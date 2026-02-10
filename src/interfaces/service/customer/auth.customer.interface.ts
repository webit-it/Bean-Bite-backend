import { CustomerResponseDTO, ICustomer, ICustomerDocument } from "../../../types/customer.type";

export interface ICustomerAuthService {
    register(
        fullName: string, phoneNumber: string, password: string
    ): Promise<{
        customer: CustomerResponseDTO | null;
        token: string;
        refreshToken: string;
    }>


    verifyOtp(
        phoneNumber: string, otp: string
    ): Promise<{
        token: string;
        message: string;
    }>;

    resendOtp(phoneNumber: string): Promise<string>;

    Login(
        phoneNumber: string,
        password: string
    ): Promise<{
        customer: CustomerResponseDTO;
        token: string;
        refreshToken: string;
    }>;
    verifyCustomer(phoneNumber: string): Promise<ICustomer>;
    resetPassword(phoneNumber: string, password: string): Promise<ICustomer>
}