import { Types } from "mongoose";
import { ICustomer, ICustomerDocument } from "../../types/customer.type";

export interface ICustomerAuthRepo{
    create(data:Partial<ICustomer>):Promise<ICustomerDocument>
    findByphoneNumber(phoneNumber:string):Promise<ICustomerDocument|null>
    saveCustomer(data:ICustomerDocument):Promise<ICustomer>
    findById(id:string):Promise<ICustomerDocument|null>
    update(id: string | Types.ObjectId,data:Partial<ICustomer>):Promise<ICustomerDocument|null>
}