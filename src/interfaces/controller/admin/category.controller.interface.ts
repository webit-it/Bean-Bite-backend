import { Request, Response } from "express";

export default interface ICategoryController {
  create(req: Request, res: Response): Promise<void>;
  getCategoryBySlug(req: Request, res: Response): Promise<void>;
  editCategory(req: Request, res: Response): Promise<void>;
getAllCategories(req: Request, res: Response): Promise<void>;
}
