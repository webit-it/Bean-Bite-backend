import { Request, Response } from "express";

export default interface ICustomerController {
      getAllUsers(req: Request, res: Response): Promise<void>;
      toggleCustomerStatus(req: Request, res: Response): Promise<void>;


}