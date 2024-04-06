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
import {AnimationState, SearchBoxState, useAnimationStore} from "../../stores/animationStore";
import hotkeyPress from "../../functions/hotkeyPress";
import randomMessage from "../../functions/randomMessage";
import {WebSocketContext, WebsocketState, WebsocketStoreState} from "../../stores/websocketStore";
import {useDebounce} from "use-debounce";
import {SearchPayload} from "../../types/ws/messages/payloads/SearchPayload";
import {MessageTypes} from "../../types/ws/messages/MessageTypes";
import {useSearchStore} from "../../stores/searchStore";
import {AutocompletePayload} from "../../types/ws/messages/payloads/AutocompletePayload";
import useAnimationReset from "../../hooks/useAnimationReset";
import SearchBoxInputRightElement from "./SearchBoxInputRightElement";
import useKey from "../../hooks/useKey";
import isTextOverflowing from "../../functions/isTextOverflowing";
import useAutocomplete from "../../hooks/useAutocomplete";
import useWebsocketStore from "../../hooks/useWebsocketStore";
import {AutocompleteResult} from "../../types/ws/results/AutocompleteResult";

export interface SearchBarProps {
    tr: any;
}

const SearchBar: React.FC<SearchBarProps> = (
    {
        tr
    }) => {

    const searchBoxRef = useRef(null)
    const currentTextRef = useRef<HTMLElement | null>(null);
    const {resetAnimations} = useAnimationReset();
    const {autocompleteText} = useAutocomplete();
    useKey('k', searchBoxRef);

    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');
    const iconColors = useColorModeValue('gray.700', 'navy.100');

    const animationStore = useAnimationStore();
    const websocketStore = useWebsocketStore();
    const searchStore = useSearchStore();

    const returnRandomMessage = useMemo(() => randomMessage(), []);

    const [value] = useDebounce(searchStore.states.search, 1000);
    const [realValue, setRealValue] = useState('');

    const autocompleteQuery : AutocompleteResult|undefined = websocketStore.states.mappedResults.AUTOCOMPLETE_QUERY;
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


    // Reset states when search is empty
    useEffect(() => {
        if (realValue.length === 0) {
            startTransition(() => {
                resetAnimations();
            });
            return;
        }
    }, [realValue]);

    // Request search results
    useEffect(() => {
        if (value === '' || value === ' ') return;

        websocketStore.actions.sendMessage<SearchPayload>({
            type: MessageTypes.SearchQuery,
            payload: {
                term: value
            }
        });

        startTransition(() => {
            animationStore.search.start();
        });
    }, [value])

    useEffect(() => {
        setAutocompleteOverflowing(isTextOverflowing(currentTextRef.current, 600));
    }, [autocompleteText])

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
                    onChange={(e) => {
                        const val = e.target.value;
                        setRealValue(val);
                        searchStore.actions.search(val)
                    }}
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
                        <SearchBoxInputRightElement
                            isAutocompleteOverflowing={isAutocompleteOverflowing}
                            autocompleteText={autocompleteText}
                            autocompleteQuery={autocompleteQuery}
                        />
                    </InputRightElement>
                }
            </InputGroup>
        </div>
    );
}

export default SearchBar;
