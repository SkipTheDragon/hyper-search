import {
    Badge,
    chakra,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Kbd,
    Spinner,
    useColorModeValue
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import React, {MutableRefObject, startTransition, useContext, useEffect, useMemo, useRef, useState} from "react";
import {AnimationState, SearchBoxState, useAnimationStore} from "../stores/animationStore";
import hotkeyPress from "../functions/hotkeyPress";
import randomMessage from "../functions/randomMessage";
import {WebSocketContext, WebsocketState, WebsocketStoreState} from "../stores/websocketStore";
import {useDebounce} from "use-debounce";
import {SearchPayload} from "../types/ws/messages/payloads/SearchPayload";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import {useSearchStore} from "../stores/searchStore";
import {AutocompletePayload} from "../types/ws/messages/payloads/AutocompletePayload";
import {useWebsocketStore} from "../context/WebSocketContextProvider";

export interface SearchBarProps {
    tr: any;
}

const SearchBar: React.FC<SearchBarProps> = (
    {
        tr
    }) => {

    const searchBoxRef = useRef(null)

    function useKey(key: string, ref: MutableRefObject<HTMLInputElement | null>) {
        const listener = (e: KeyboardEvent) => hotkeyPress(key, ref, e);
        useEffect(() => {
            document.addEventListener('keydown', listener);
            return () => document.removeEventListener('keydown', listener);
        }, [key]);
    }


    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');
    const iconColors = useColorModeValue('gray.700', 'navy.100');

    const animationStore = useAnimationStore();
    const websocketStore = useWebsocketStore((store : WebsocketStoreState)=> store);
    const searchStore = useSearchStore();

    const isMac = navigator.userAgent.includes('Mac') // true

    const returnRandomMessage = useMemo(() => randomMessage(), []);

    const [value] = useDebounce(searchStore.states.search, 1000);

    // Get search query from window
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('q')) {
            const searchQuery = urlParams.get('q');
            if (searchQuery) {
                searchStore.actions.search(searchQuery);
            }
        }
    }, []);

    useKey('k', searchBoxRef);

    // Request search results
    useEffect(() => {
        if (value.length === 0) {
            startTransition(() => {
                animationStore.search.reset();
                animationStore.animation.reset();
            });
            return;
        }

        websocketStore.actions.sendMessage<SearchPayload>({
            type: MessageTypes.SearchQuery,
            payload: {
                term: value
            }
        });

        startTransition(() => {
            animationStore.search.start();
        });

    }, [value]);

    const [autocompleteText, setAutocompleteText] = useState<string[]>([]);

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
            autocompleteQuery.data.length > 0
        ) {
            const words = searchStore.states.search.split(' ');
            if (autocompleteQuery.data[0].normalized.startsWith(words[words.length - 1])) {
                setAutocompleteText([
                    searchStore.states.search,
                    autocompleteQuery.data[0].normalized.replace(words[words.length - 1], ''),
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

    return (
        <div>
            <InputGroup size="lg" className={'search-input'}>
                <InputLeftElement pointerEvents='none'>
                    {
                        animationStore.states.animation === AnimationState.Running ?
                            <Spinner
                                size="xs"
                                color={
                                    animationStore.states.searchBox === SearchBoxState.Focused ? iconColors : 'var(--chakra-colors-chakra-border-color)'
                                }/>
                            :
                            <SearchIcon
                                style={tr}
                                color={
                                    animationStore.states.searchBox === SearchBoxState.Focused ? iconColors : 'var(--chakra-colors-chakra-border-color)'
                                }
                            />
                    }

                    {
                        searchStore.states.search.length !== 0 &&
                        autocompleteText &&
                        <chakra.div
                            position={'absolute'}
                            left={'100%'}
                            letterSpacing={'0.15px'}
                            width={'720px'}
                            textAlign={'left'}
                        >
                            <chakra.span opacity={'0'} fontWeight={400} fontSize={'1rem'}>
                                {autocompleteText[0]}
                            </chakra.span>
                            <chakra.span marginLeft={'0.5px'}
                                         color={'gray.500'}
                                         fontWeight={600}
                                         fontSize={'1rem'}>
                                {autocompleteText[autocompleteText.length - 1]}
                            </chakra.span>
                        </chakra.div>
                    }
                </InputLeftElement>
                <Input
                    onBlur={() => animationStore.searchBox.blur()}
                    onFocus={() => animationStore.searchBox.focus()}
                    onChange={(e) => searchStore.actions.search(e.target.value)}
                    value={searchStore.states.search}
                    color={searchTextColor}
                    borderBottomRadius={animationStore.states.animation === AnimationState.Finished ? '0' : 'md'}
                    bg={searchBg}
                    ref={searchBoxRef}
                    disabled={websocketStore.states.state !== WebsocketState.Connected}
                    autoComplete="off"
                    id="hyper-search"
                    fontSize={"1rem"}
                    size="lg"
                    placeholder={returnRandomMessage}
                />
                {
                    <InputRightElement pointerEvents='none'
                                       width={animationStore.states.searchBox === SearchBoxState.Focused && animationStore.states.animation === AnimationState.Finished ? '8rem' : '5.5rem'}>
                        {
                            animationStore.states.searchBox !== SearchBoxState.Focused &&
                            <div>
                                <Kbd>
                                    {
                                        isMac ? '⌘' : 'alt'
                                    }
                                </Kbd> + <Kbd>K</Kbd>
                            </div>
                        }
                        {
                            animationStore.states.searchBox === SearchBoxState.Focused &&
                            autocompleteText.length > 0 &&
                            autocompleteText[autocompleteText.length - 1] !== '' &&
                            <div>
                                <Kbd>
                                    {
                                        isMac ? '⌘' : 'alt'
                                    }
                                </Kbd> +
                                <Kbd>→</Kbd>
                            </div>
                        }
                        {
                            animationStore.states.searchBox === SearchBoxState.Focused &&
                            animationStore.states.animation === AnimationState.Finished &&
                            websocketStore.states.mappedResults.SEARCH_QUERY &&
                            (autocompleteText[autocompleteText.length - 1] === '' || autocompleteText.length === 0) &&
                            <Badge
                                colorScheme="green"
                                variant="subtle">
                                Took: {websocketStore.states.mappedResults?.SEARCH_QUERY?.extra.executionTime.took}
                            </Badge>
                        }


                    </InputRightElement>
                }
            </InputGroup>
        </div>
    );
}

export default SearchBar;
