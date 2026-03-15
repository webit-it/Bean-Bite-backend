import { Request, Response } from "express";
import { IAdminDashboardController } from "../../interfaces/controller/admin/admin.dashboard.controller.interface";
import IDashboardServiceInterface from "../../interfaces/service/admin/dashboard.service.interface";
import HttpStatus from "../../constants/httpsStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";


export class AdminDashboardController implements IAdminDashboardController {
  constructor(private _dashboardService: IDashboardServiceInterface) { }
 getDashboardCounts = async (req: Request, res: Response) => {
  try {
    const result = await this._dashboardService.getDashboardCounts();

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts"
    });
  }
};
getNotifications = async (req: Request, res: Response) => {
   try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 6;
     

      const result =await this._dashboardService.getNotifications(page, limit);

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

