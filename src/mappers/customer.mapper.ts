import { CustomerResponseDTO, ICustomerDocument } from "../types/customer.type";


export class CustomerMapper {
  static toResponse(doc: ICustomerDocument): CustomerResponseDTO {
    return {
      id: doc._id.toString(),
      fullName: doc.fullName,
      phoneNumber: doc.phoneNumber,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
    };
  }
}

export const toCustomerResponseDtoArray = (
  categories: ICustomerDocument[]
): CustomerResponseDTO[] => {
  return categories.map(CustomerMapper.toResponse);
};
