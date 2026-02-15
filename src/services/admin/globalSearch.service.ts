import { ISearchRepository } from "../../interfaces/repository/global.search.repository.interface";
import IGlobalSearchServiceInteface from "../../interfaces/service/admin/global.search.service.interface";

export class GlobalSearchService implements IGlobalSearchServiceInteface {
  constructor(
    private readonly searchRepository: ISearchRepository
  ) {}

  async globalSearch(query: string){
    if (!query || query.trim().length < 2) {
      return {
        products: [],
        categories: [],
        users: []
      };
    }

    return this.searchRepository.globalSearch(query.trim());
  }
}