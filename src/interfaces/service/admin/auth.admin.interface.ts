import { CustomerResponseDTO } from "../../../types/customer.type";

export interface IAdminAuthService {
  adminLogin(
    phoneNumber: string,
    password: string
  ): Promise<{
    user: CustomerResponseDTO;
    token: string;
  }>;

  adminLogout(): Promise<{
    message: string;
  }>;
}
