import { CustomerResponseDTO, ICustomer, ICustomerDocument } from "../../../types/customer.type";

export interface ICustomerAuthService {
  register(
    fullName: string,
    phoneNumber: string,
    password: string
  ): Promise<{
    customer: CustomerResponseDTO;
    token: string;
    refreshToken: string;
  }>;

   Login(
    phoneNumber: string,
    password: string
  ): Promise<{
    customer: CustomerResponseDTO;
    token: string;
    refreshToken: string;
  }>;
  verifyOtp(
    phoneNumber: string,
    otp: string
  ): Promise<{ token: string; message: string }>;

  resendOtp(phoneNumber: string): Promise<string>;

  verifyCustomer(phoneNumber: string): Promise<ICustomer>;

  resetPassword(token: string, password: string): Promise<ICustomer>;
  
  updateRefreshToken(
    customerId: string,
    refreshToken: string | null
  ): Promise<void>;
  

findById(customerId: string): Promise<ICustomerDocument | null>;
clearRefreshToken(refreshToken: string): Promise<void>;
}