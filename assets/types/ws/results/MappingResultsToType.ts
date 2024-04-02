import {SuggestionResult} from "./SuggestionResult";
import {SearchResult} from "./SearchResult";
import {MessageTypes} from "../messages/MessageTypes";
import {AutocompleteResult} from "./AutocompleteResult";
import {CategoryResult} from "./CategoryResult";

export type MappingResultsToType = {
    [MessageTypes.SuggestionsQuery]: SuggestionResult;
    [MessageTypes.SearchQuery]: SearchResult;
    [MessageTypes.AutocompleteQuery]: AutocompleteResult;
    [MessageTypes.FetchCategoriesQuery]: CategoryResult;
}
