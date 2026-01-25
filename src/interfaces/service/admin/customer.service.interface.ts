import { ICustomer, PaginatedCustomerResponse } from "../../../types/customer.type";


export default interface ICustomerServiceInterface {
    getAllCustomers( 
      page: number,
      limit: number,
      search?: string
    ): Promise<PaginatedCustomerResponse>;
      toggleCustomerStatus(id: string): Promise<ICustomer>;
    
}
