import { ICustomer, ICustomerDocument } from "../../types/customer.type";

export interface ICustomerAuthRepo {
    create(data: Partial<ICustomer>): Promise<ICustomerDocument>
    findByphoneNumber(phoneNumber: string): Promise<ICustomerDocument | null>
    findById(customerId: string): Promise<ICustomerDocument | null>
    findAllPaginated( page: number, limit: number, search?: string): Promise<{ data: ICustomerDocument[]; total: number; page: number; limit: number; }>
    update( customerId: string, data: Partial<ICustomer> ): Promise<ICustomerDocument | null>
    saveCustomer(data: ICustomerDocument): Promise<ICustomer>
}