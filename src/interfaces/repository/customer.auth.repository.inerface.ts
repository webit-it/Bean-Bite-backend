import { Types, UpdateQuery } from "mongoose";
import { ICustomer, ICustomerDocument, PaginatedCustomers } from "../../types/customer.type";

export interface ICustomerAuthRepo {
    create(data: Partial<ICustomer>): Promise<ICustomerDocument>
    findByphoneNumber(phoneNumber: string): Promise<ICustomerDocument | null>
    saveCustomer(data: ICustomerDocument): Promise<ICustomer>
    findAllPaginated(
        page: number,
        limit: number,
        search?: string
    ): Promise<PaginatedCustomers>;

    update(
        id: string | Types.ObjectId,
        data: UpdateQuery<ICustomer>
    ): Promise<ICustomer | null>;
    findById(id: string): Promise<ICustomer | null>;

}