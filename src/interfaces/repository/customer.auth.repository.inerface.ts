import { ICustomer, ICustomerDocument } from "../../types/customer.type";

export interface ICustomerAuthRepo {
  create(data: Partial<ICustomer>): Promise<ICustomerDocument>;

  findByphoneNumber(phoneNumber: string): Promise<ICustomerDocument | null>;

  findById(customerId: string): Promise<ICustomerDocument | null>;

  findByRefreshToken(
    refreshToken: string
  ): Promise<ICustomerDocument | null>;
  update( customerId: string, data: Partial<ICustomer> ): Promise<ICustomerDocument | null>;
  updateRefreshToken(
    customerId: string,
    refreshToken: string | null
  ): Promise<void>;

  saveCustomer(data: ICustomerDocument): Promise<ICustomerDocument>;

  findAllPaginated(
    page: number,
    limit: number,
    search?: string,
    isActive?:boolean
  ): Promise<{
    data: ICustomerDocument[];
    total: number;
    page: number;
    limit: number;
  }>;
}