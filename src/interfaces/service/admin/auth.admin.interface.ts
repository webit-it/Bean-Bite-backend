import { ICustomerDocument } from "../../../types/customer.type";

export interface IAdminAuthService {
  adminLogin(
    phoneNumber: string,
    password: string
  ): Promise<{
    user: ICustomerDocument;
    token: string;
  }>;
}
