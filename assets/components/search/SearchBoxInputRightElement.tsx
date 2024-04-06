import {AnimationState, SearchBoxState, useAnimationStore} from "../../stores/animationStore";
import {Badge, Kbd, Tooltip} from "@chakra-ui/react";
import React from "react";
import {AutocompleteResult} from "../../types/ws/results/AutocompleteResult";
import useWebsocketStore from "../../hooks/useWebsocketStore";

export default function (
    {
        isAutocompleteOverflowing,
        autocompleteText,
        autocompleteQuery
    } : {
        isAutocompleteOverflowing: boolean,
        autocompleteText: string[],
        autocompleteQuery: AutocompleteResult|undefined
    }
) {
    const animationStore = useAnimationStore();
    const isMac = navigator.userAgent.includes('Mac') // true
    const websocketStore = useWebsocketStore();

    if (animationStore.states.searchBox !== SearchBoxState.Focused) {
        return (
            <div>
                <Kbd>
                    {
                        isMac ? '⌘' : 'alt'
                    }
                </Kbd> + <Kbd>K</Kbd>
            </div>
        );
    }

    if (animationStore.states.searchBox === SearchBoxState.Focused &&
        autocompleteText.length > 0 &&
        !isAutocompleteOverflowing &&
        autocompleteText[autocompleteText.length - 1] !== '') {

        return (
            <div>
                <Kbd>
                    {
                        isMac ? '⌘' : 'alt'
                    }
                </Kbd> +
                <Kbd>→</Kbd>
            </div>
        );
    }

    if (animationStore.states.searchBox === SearchBoxState.Focused &&
        animationStore.states.animation === AnimationState.Finished &&
        websocketStore.states.mappedResults.SEARCH_QUERY &&
        (autocompleteText[autocompleteText.length - 1] === '' || autocompleteText.length === 0)) {

        return (
            <Badge
                colorScheme="green"
                variant="subtle">
                Took: {websocketStore.states.mappedResults?.SEARCH_QUERY?.extra.executionTime.took}
            </Badge>
        );
    }

    if (isAutocompleteOverflowing &&
        autocompleteQuery &&
        autocompleteQuery.data.length > 0 &&
        "normalized" in autocompleteQuery.data[0]
    ) {
        return (
            <Tooltip label={"Press " + (isMac ? '⌘' : 'alt') + ' and → simultaneously to autocomplete this word.'}
                     hasArrow>
                <Badge
                    cursor="pointer"
                    colorScheme="brand"
                    variant="subtle">
                    {autocompleteQuery.data[0].normalized}
                </Badge>
            </Tooltip>
        );
    }
}
