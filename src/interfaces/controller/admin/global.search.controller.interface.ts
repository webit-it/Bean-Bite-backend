import { Request, Response } from "express";

export default interface IGlobalSearchController {
  globalSearch (req: Request, res: Response): Promise<void>
}