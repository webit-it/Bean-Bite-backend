import { GlobalSearchResult } from "../../types/globalSearch.type";

export interface ISearchRepository {
  globalSearch(query: string): Promise<GlobalSearchResult>;
}