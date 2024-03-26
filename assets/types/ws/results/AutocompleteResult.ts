import {BasicResult} from "./BasicResult";
import {SearchResultItem} from "./SearchResultItem";
import {AutocompleteResultItem} from "./AutocompleteResultItem";

export interface AutocompleteResult extends BasicResult {

    data: AutocompleteResultItem[],
}
