import { CustomerResponseDTO, ICustomer, PaginatedCustomerResponse } from "../../../types/customer.type";


export default interface ICustomerServiceInterface {
    getAllCustomers( 
      page: number,
      limit: number,
      search?: string,
      isActive?:boolean
    ): Promise<PaginatedCustomerResponse>;
      toggleCustomerStatus(id: string): Promise<CustomerResponseDTO>;
    
}
