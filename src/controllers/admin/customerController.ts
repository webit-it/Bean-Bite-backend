
import { Request, Response } from "express";
import ICustomerServiceInterface from "../../interfaces/service/admin/customer.service.interface";
import ICustomerController from "../../interfaces/controller/admin/customer.controller.interface";
import HttpStatus from "../../constants/httpsStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";



export class CustomerController implements ICustomerController{
  constructor(private _userService:ICustomerServiceInterface) {}

getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search as string | undefined;

    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;

    const result = await this._userService.getAllCustomers(
      page,
      limit,
      search,
      isActive
    );

    res.status(HttpStatus.OK).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: unknown) {
    console.log("Get all customers controller error:", error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
  toggleCustomerStatus=async(req: Request, res: Response)=>{
     try {
      const { id } = req.params;
      
    const updatedData=await this._userService.toggleCustomerStatus(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.CUSTOMER_STATUS_TOGGLED,
        data:updatedData
      });

    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}