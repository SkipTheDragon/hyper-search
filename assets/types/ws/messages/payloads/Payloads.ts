import {SuggestionPayload} from "./SuggestionPayload";
import {SearchPayload} from "./SearchPayload";
import {AutocompletePayload} from "./AutocompletePayload";
import {EmptyPayload} from "./EmptyPayload";

export type Payloads = SuggestionPayload | SearchPayload | AutocompletePayload | EmptyPayload;
