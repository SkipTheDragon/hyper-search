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
import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {ExtraData} from "../pages/search";
import {AnimationState, SearchBoxState, SearchState, useAnimationStore} from "../stores/animationStore";
import hotkeyPress from "../functions/hotkeyPress";
import randomMessage from "../functions/randomMessage";
import {useWebsocketStore} from "../stores/websocketStore";

export interface SearchBarProps {
    setValue: (val: string) => void
    value: string;
    tr: any;
}

const SearchBar: React.FC<SearchBarProps> = (
    {
        setValue,
        value,
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
    const websocketStore = useWebsocketStore();

    const isMac = navigator.userAgent.includes('Mac') // true

    const returnRandomMessage = useCallback(randomMessage, []);

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
                onChange={(e) => setValue(e.target.value)}
                value={value}
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
                        animationStore.states.searchBox === SearchBoxState.Focused && animationStore.states.animation === AnimationState.Finished &&
                        <Badge
                            colorScheme="green"
                            variant="subtle">
                            Took: {websocketStore.states.lastMessage?.extraData.executionTime.took}
                        </Badge>
                    }


                </InputRightElement>
            }
        </InputGroup>
    );
}

export default SearchBar;
