import {BasicResult} from "./BasicResult";
import {AutocompleteResultItem} from "./AutocompleteResultItem";

export interface AutocompleteResult extends BasicResult {
    data: AutocompleteResultItem[],
}
