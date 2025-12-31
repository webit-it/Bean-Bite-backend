import { ICustomer, ICustomerDocument } from "../../../types/customer.type";

export interface ICustomerAuthService {
    register(
        fullName: string, phoneNumber: string, password: string
    ): Promise<{
        customer: ICustomer | null;
        token: string;
        refreshToken: string;
    }>
 

    verifyOtp(
       phoneNumber: string, otp: string
    ): Promise<{
        customer: ICustomerDocument;
        message: string;
    }>; 

    resendOtp(phoneNumber: string): Promise<string>;

    Login(
        phoneNumber: string,
        password: string
    ): Promise<{
        user: ICustomer;
        token: string;
        refreshToken: string;
    }>;
    forgotPassword(phoneNumber: string): Promise<ICustomer>;
}