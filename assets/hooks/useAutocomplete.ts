import {useEffect, useState} from "react";
import {AutocompletePayload} from "../types/ws/messages/payloads/AutocompletePayload";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import {SearchBoxState, useAnimationStore} from "../stores/animationStore";
import {useSearchStore} from "../stores/searchStore";
import useWebsocketStore from "./useWebsocketStore";

export default function () {
    const searchStore = useSearchStore();
    const websocketStore = useWebsocketStore();
    const [autocompleteText, setAutocompleteText] = useState<string[]>([]);
    const animationStore = useAnimationStore();

    const autocompleteQuery = websocketStore.states.mappedResults.AUTOCOMPLETE_QUERY;

    // Request autocomplete results
    useEffect(() => {
        if (searchStore.states.search.length >= 1) {
            const words = searchStore.states.search.split(' ');

            websocketStore.actions.sendMessage<AutocompletePayload>({
                type: MessageTypes.AutocompleteQuery,
                payload: {
                    term: words[words.length - 1]
                }
            });
        }
    }, [searchStore.states.search]);

    // Set autocomplete text
    useEffect(() => {
        if (
            searchStore.states.search.length !== 0 &&
            autocompleteQuery &&
            autocompleteQuery.data &&
            autocompleteQuery.data.length > 0 &&
            "normalized" in autocompleteQuery.data[0]
        ) {
            const words = searchStore.states.search.split(' ');
            if (autocompleteQuery.data[0].normalized.startsWith(words[words.length - 1])) {
                const autocompleteValue = autocompleteQuery.data[0].normalized.replace(words[words.length - 1], '');

                if (autocompleteValue === '*') {
                    return;
                }

                setAutocompleteText([
                    searchStore.states.search,
                    autocompleteValue,
                ]);
                return;
            }
        }
        setAutocompleteText([]);

    }, [searchStore.states.search, autocompleteQuery]);


    // Autocomplete on meta + arrow right
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' &&
                e.metaKey &&
                animationStore.states.searchBox === SearchBoxState.Focused &&
                autocompleteQuery &&
                autocompleteQuery.data[0].normalized
            ) {
                const words = searchStore.states.search.split(' ');
                words[words.length - 1] = autocompleteQuery.data[0].normalized;
                searchStore.actions.search(words.join(' '));
            }
        };

        document.addEventListener('keydown', listener);

        return () => document.removeEventListener('keydown', listener);
    }, [autocompleteQuery, animationStore.states.searchBox, searchStore.states.search]);

    return {
        autocompleteText
    }
}
