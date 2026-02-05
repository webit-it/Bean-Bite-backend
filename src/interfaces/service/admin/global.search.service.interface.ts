import { GlobalSearchResult } from "../../../types/globalSearch.type";

export default interface IGlobalSearchServiceInteface {
globalSearch(query: string): Promise<GlobalSearchResult>

}
