import { ICustomer, ICustomerDocument } from "../../types/customer.type";

export interface ICustomerAuthRepo{
    create(data:Partial<ICustomer>):Promise<ICustomerDocument>
    findByphoneNumber(phoneNumber:string):Promise<ICustomerDocument|null>
    saveCustomer(data:ICustomerDocument):Promise<ICustomer>
}