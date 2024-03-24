import {
    Badge,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Kbd,
    Spinner,
    useColorModeValue
} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import React, {MutableRefObject, useCallback, useContext, useEffect, useRef} from "react";
import {AnimationState, SearchBoxState, useAnimationStore} from "../stores/animationStore";
import hotkeyPress from "../functions/hotkeyPress";
import randomMessage from "../functions/randomMessage";
import {WebSocketContext} from "../stores/websocketStore";
import {useDebounce} from "use-debounce";
import {SearchPayload} from "../types/ws/messages/payloads/SearchPayload";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import {useSearchStore} from "../stores/searchStore";

export interface SearchBarProps {
    tr: any;
}

const SearchBar: React.FC<SearchBarProps> = (
    {
        tr
    }) => {

    const searchBoxRef = useRef(null)
    function useKey(key: string, ref: MutableRefObject<HTMLInputElement | null>) {
        useEffect(() => {
            document.addEventListener('keydown', (e) => hotkeyPress(key, ref, e));
            return () => document.removeEventListener('keydown', (e) => hotkeyPress(key, ref, e));
        }, [key]);
    }
    useKey('k', searchBoxRef);

    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');
    const iconColors = useColorModeValue('gray.700', 'navy.100');

    const animationStore = useAnimationStore();
    const websocketStore = useContext(WebSocketContext).getState();
    const searchStore = useSearchStore();

    const isMac = navigator.userAgent.includes('Mac') // true

    const returnRandomMessage = useCallback(randomMessage, []);

    const [value] = useDebounce(searchStore.states.search, 1000);

    useEffect(() => {
        if (value.length === 0) {
            animationStore.search.reset();
            animationStore.animation.reset();
            return;
        }

        websocketStore.actions.sendMessage<SearchPayload>({
            type: MessageTypes.SearchQuery,
            payload: {
                term: value
            }
        });

        animationStore.search.start();

    }, [value]);

    return (
        <InputGroup size="lg" className={'search-input'}>
            <InputLeftElement pointerEvents='none'>
                {animationStore.states.animation === AnimationState.Running ?
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
                    />}
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
                id="hyper-search"
                fontSize={"1rem"}
                size="lg"
                placeholder={returnRandomMessage()}
            />
            {
                <InputRightElement pointerEvents='none'
                                   width={animationStore.states.searchBox === SearchBoxState.Focused && animationStore.states.animation === AnimationState.Finished ? '8rem' : '5.5rem'}>
                    {
                        animationStore.states.searchBox !== SearchBoxState.Focused && <div>
                            <Kbd>
                                {
                                    isMac ? '⌘' : 'alt'
                                }
                            </Kbd> + <Kbd>K</Kbd>
                        </div>
                    }
                    {
                        animationStore.states.searchBox === SearchBoxState.Focused &&
                        animationStore.states.animation === AnimationState.Finished &&
                        websocketStore.states.mappedResults.SEARCH_QUERY &&
                        <Badge
                            colorScheme="green"
                            variant="subtle">
                            Took: {websocketStore.states.mappedResults?.SEARCH_QUERY?.extra.executionTime.took}
                        </Badge>
                    }


                </InputRightElement>
            }
        </InputGroup>
    );
}

export default SearchBar;
