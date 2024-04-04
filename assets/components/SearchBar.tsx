import {
    Badge,
    chakra,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Kbd,
    Spinner, Tooltip,
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
    const currentTextRef = useRef<HTMLElement | null>(null);

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
    const websocketStore = useWebsocketStore<WebsocketStoreState>((store: WebsocketStoreState) => store);
    const searchStore = useSearchStore();

    const isMac = navigator.userAgent.includes('Mac') // true

    const returnRandomMessage = useMemo(() => randomMessage(), []);

    const [value] = useDebounce(searchStore.states.search, 1000);
    const [isAutocompleteOverflowing, setAutocompleteOverflowing] = useState(false);

    // Get search query from window
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('q') && websocketStore.states.state === WebsocketState.Connected) {
            const searchQuery = urlParams.get('q');
            if (searchQuery) {
                searchStore.actions.search(searchQuery);
            }
        }
    }, [websocketStore.states.state]);

    useKey('k', searchBoxRef);

    // Request search results
    useEffect(() => {
        if (value.length === 0) {
            startTransition(() => {
                animationStore.search.reset();
                animationStore.animation.reset();
                document.body.classList.remove('opacity')
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

    useEffect(() => {
        const localCurrentText = currentTextRef.current;

        if (localCurrentText === null) {
            return;
        }

        if (localCurrentText.offsetWidth > 600) {
            setAutocompleteOverflowing(true);
        } else if (localCurrentText.offsetWidth < 600) {
            setAutocompleteOverflowing(false);
        }
    }, [autocompleteText])

    const handleRightInputElement = () => {
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

        return null;
    }

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
                        !isAutocompleteOverflowing &&
                        animationStore.states.searchBox === SearchBoxState.Focused &&
                        autocompleteText &&
                        <chakra.div
                            position={'absolute'}
                            left={'100%'}
                            letterSpacing={'0'}
                            width={'720px'}
                            whiteSpace={'nowrap'}
                            textAlign={'left'}
                            overflow={'hidden'}
                        >
                            <chakra.span
                                ref={currentTextRef}
                                opacity={'0'}
                                fontWeight={400}
                                fontSize={'1rem'}
                            >
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
                    paddingRight={animationStore.states.searchBox === SearchBoxState.Blurred ? '0' : '10rem'}
                    placeholder={returnRandomMessage}
                />
                {
                    <InputRightElement paddingRight="1.2rem"
                                       width="fit-content">

                        {handleRightInputElement()}

                    </InputRightElement>
                }
            </InputGroup>
        </div>
    );
}

export default SearchBar;
