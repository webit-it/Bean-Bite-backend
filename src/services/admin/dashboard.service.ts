import IDashboardServiceInterface from "../../interfaces/service/admin/dashboard.service.interface";
import IProductRepository from "../../interfaces/repository/product.repository.interface";
import { ICustomerAuthRepo } from "../../interfaces/repository/customer.auth.repository.inerface";
import { IRewardHIstoryRepo } from "../../interfaces/repository/reward.history.repository.interface";
import { INotificationRepository } from "../../interfaces/repository/notification.repository.interface";
import { RewardHistoryMapper } from "../../mappers/reward.history.mapper";

export class DashboardService implements IDashboardServiceInterface {
  constructor(
    private _productRepository: IProductRepository,
    private _customerRepository: ICustomerAuthRepo,
    private _rewardHistoryRepository: IRewardHIstoryRepo,
  ) {}
  async getDashboardCounts() {
  const [products, users, rewards] = await Promise.all([
    this._productRepository.count(),
    this._customerRepository.count({ isAdmin: false }),
    this._rewardHistoryRepository.count()
  ]);

  return {
    products,
    users,
    rewards
  };
}

async getRecentReward(page: number,limit: number,){

  const result =await this._rewardHistoryRepository.findAllPaginated(page, limit);
  return {
    data: result.data.map(RewardHistoryMapper.toResponse), 
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
  };
}
}

