import { ICustomerAuthRepo } from "../interfaces/repository/customer.auth.repository.inerface";
import { Customer } from "../models/customer.model";
import { ICustomerDocument } from "../types/customer.type";
import { BaseRepository } from "./base.reposiory";


export class CustomerAuthRepository extends BaseRepository<ICustomerDocument> implements ICustomerAuthRepo{
    constructor(){
        super(Customer)
    }
    async findByphoneNumber(phoneNumber:string){
        return await Customer.findOne({phoneNumber})
    }
    async saveCustomer(data:ICustomerDocument){
        return await data.save()
    }
} 