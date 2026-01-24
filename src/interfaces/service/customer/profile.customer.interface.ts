import { ICustomer, ICustomerDocument } from "../../../types/customer.type";

export interface IProfileService{
    getProfile(phoneNumber:string):Promise<ICustomer>
    editProfile(customerId: string, fullName: string, phoneNumber?: string):Promise<ICustomerDocument>
}