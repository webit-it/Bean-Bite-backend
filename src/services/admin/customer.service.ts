import { Types } from "mongoose";
import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import { ICustomerAuthRepo } from "../../interfaces/repository/customer.auth.repository.inerface";
import ICustomerServiceInterface from "../../interfaces/service/admin/customer.service.interface";
import { CustomerMapper } from "../../mappers/customer.mapper";
import AppError from "../../utils/AppError";


export class CustomerService implements ICustomerServiceInterface {
  constructor(private _customerRepository: ICustomerAuthRepo) { }

getAllCustomers = async (
  page: number,
  limit: number,
  search?: string,
  isActive?: boolean
) => {

  const result = await this._customerRepository.findAllPaginated(
    page,
    limit,
    search,
    isActive
  );

  return {
    data: result.data.map(CustomerMapper.toResponse),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
  };
};
  toggleCustomerStatus = async (id: string) => {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError(
          Messages.INVALID_CUSTOMER_ID,
          HttpStatus.BAD_REQUEST
        );
      }
      const user = await this._customerRepository.findById(id);

      if (!user) {
        throw new AppError(
          Messages.CUSTOMER_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      const updated = await this._customerRepository.update(id, {
        isActive: !user.isActive,
      });

      if (!updated) {
        throw new AppError(
          Messages.UPDATE_FAILED,
          HttpStatus.NOT_FOUND
        );
      }

      return CustomerMapper.toResponse(updated);
    } catch (error) {
      throw error;
    }
  };

}