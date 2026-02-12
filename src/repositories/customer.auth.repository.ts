import { ICustomerAuthRepo } from "../interfaces/repository/customer.auth.repository.inerface";
import { Customer } from "../models/customer.model";
import { CustomerSearchQuery, ICustomerDocument } from "../types/customer.type";
import { BaseRepository } from "./base.reposiory";

export class CustomerAuthRepository
  extends BaseRepository<ICustomerDocument>
  implements ICustomerAuthRepo
{
  constructor() {
    super(Customer);
  }

  async findByphoneNumber(phoneNumber: string) {
    return await Customer.findOne({ phoneNumber });
  }

  async findById(id: string) {
    return await Customer.findById(id);
  }

  async findByRefreshToken(refreshToken: string) {
    return await Customer.findOne({ refreshToken });
  }

  async saveCustomer(data: ICustomerDocument) {
    return await data.save();
  }

async updateRefreshToken(
  customerId: string,
  refreshToken: string | null
): Promise<void> {
  await Customer.findByIdAndUpdate(customerId, {
    refreshToken,
  });
}
  async findAllPaginated(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const query: CustomerSearchQuery = {
      isAdmin: false,
    };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}