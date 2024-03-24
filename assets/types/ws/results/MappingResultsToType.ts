import {SuggestionResult} from "./SuggestionResult";
import {SearchResult} from "./SearchResult";
import {MessageTypes} from "../messages/MessageTypes";

export type MappingResultsToType = {
    [MessageTypes.SuggestionsQuery]: SuggestionResult;
    [MessageTypes.SearchQuery]: SearchResult;
}
