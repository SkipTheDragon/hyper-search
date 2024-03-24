import {BasicResult} from "./BasicResult";
import {SearchResultItem} from "./SearchResultItem";

export interface SearchResult extends BasicResult {
    data: SearchResultItem[],
}
