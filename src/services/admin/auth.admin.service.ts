import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../constants/httpsStatusCode";
import { ICustomerAuthRepo } from "../../interfaces/repository/customer.auth.repository.inerface";
import { IAdminAuthService } from "../../interfaces/service/admin/auth.admin.interface";
import { CustomerMapper } from "../../mappers/customer.mapper";

export class AdminAuthService implements IAdminAuthService {
  constructor(private _customerRepo: ICustomerAuthRepo) {}

  async adminLogin(phoneNumber: string, password: string) {
    const user = await this._customerRepo.findByphoneNumber(phoneNumber);

    if (!user) {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: Messages.CUSTOMER_NOT_FOUND,
      };
    }

    if (!user.isAdmin) {
      throw {
        status: HttpStatus.FORBIDDEN,
        message: "Access denied. Admin only",
      };
    }

    if (!user.password) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "Password is missing for this user",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw {
        status: HttpStatus.UNAUTHORIZED,
        message: Messages.PASSWORD_DO_NOT_MATCH,
      };
    }

    const id =
      typeof user._id === "string" ? user._id : user._id.toString();
    const token = generateToken(id, true);
    return {
      user:CustomerMapper.toResponse(user),
      token,
    };
  }
  async adminLogout() {
    return {
      message: "Admin logged out successfully",
    };
  }
}
