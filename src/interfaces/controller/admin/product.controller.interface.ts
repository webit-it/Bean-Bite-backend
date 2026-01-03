import { Request, Response } from "express";

export default interface IProductController {
  create(req: Request, res: Response): Promise<void>;
  getProductBySlug(req: Request, res: Response): Promise<void>;
  editProduct(req: Request, res: Response): Promise<void>;
  getAllProducts(req: Request, res: Response): Promise<void>;
//   toggleProductStatus(req: Request, res: Response): Promise<void>;
}
