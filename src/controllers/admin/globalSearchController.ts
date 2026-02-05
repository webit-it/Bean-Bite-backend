import { Request, Response } from "express";
import { GlobalSearchService } from "../../services/admin/globalSearch.service";
import IGlobalSearchController from "../../interfaces/controller/admin/global.search.controller.interface";

export class GlobalSearchController implements IGlobalSearchController {
  constructor(
    private readonly searchService: GlobalSearchService
  ) {}

  globalSearch = async (req: Request, res: Response)=> {
    try {
      const query = req.query.search as string;

      const result = await this.searchService.globalSearch(query);

      res.status(200).json({
        success: true,
        message: "Global search results",
        data: result
      });
    } catch (error) {
      console.error("Global search error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to perform global search"
      });
    }
  };
}