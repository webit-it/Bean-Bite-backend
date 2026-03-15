import { Request, Response } from "express";

export interface IAdminDashboardController {
 getDashboardCounts(req: Request, res: Response): Promise<void>;
}
