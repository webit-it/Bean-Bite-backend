import { Request, Response } from "express";

export default interface ICategoryCustomerController {
getAllCategories(req: Request, res: Response): Promise<void>;
}
