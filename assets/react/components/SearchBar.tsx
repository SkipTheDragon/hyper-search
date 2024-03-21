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
import React, {MutableRefObject, useCallback, useEffect, useMemo, useRef} from "react";
import {AnimationState, ExtraData} from "../controllers/SearchController";

export interface SearchBarProps {
    animationState: AnimationState;
    isSearchFocused: boolean;
    extraSearchResultData: ExtraData
    setIsSearchFocused: (val: boolean) => void;
    setValue: (val: string) => void
    value: string;
    tr: any;
}

const SearchBar: React.FC<SearchBarProps> = (
    {
        animationState,
        isSearchFocused,
        setIsSearchFocused,
        extraSearchResultData,
        setValue,
        value,
        tr
    }) => {

    function useKey(key:string, ref: MutableRefObject<HTMLInputElement|null>) {
        useEffect(() => {
            function hotkeyPress(e: KeyboardEvent) {
                if (ref.current === null) {
                    console.error('Ref is null');
                    return;
                }

                if (!("focus" in ref.current)) {
                    console.error('Ref Element doesn\'t have focus method');
                    return;
                }

                if (e.metaKey && e.key === key) {
                    e.preventDefault();
                    ref.current.focus();
                }
            }

            document.addEventListener('keydown', hotkeyPress);
            return () => document.removeEventListener('keydown', hotkeyPress);
        }, [key]);
    }

    const searchBoxRef = useRef(null)
    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');
    const iconColors = useColorModeValue('gray.700', 'navy.100');

    useKey('k', searchBoxRef);

    const isMac = navigator.userAgent.includes('Mac') // true

    const returnRandomMessage = useCallback(() => {
        const messages = [
            "Searching for aliens: Is it just like finding a needle in a cosmic haystack?",
            "Quest for space donuts: How to navigate the galaxy in search of the perfect treat?",
            "Hunting for lost tools in zero gravity: Where did my wrench float off to this time?",
            "Search party in space: Can we organize a rescue mission for that lost pen?",
            "In pursuit of the ultimate space playlist: Where to find the grooviest cosmic tunes?",
            "Scavenger hunt on the ISS: Who can find the hidden stash of freeze-dried ice cream first?",
            "Hilarious space memes: Where to search for the best zero-gravity laughs?",
            "Lost in translation: How to decipher alien emojis in interstellar messages?",
            "Space treasure hunting: Seeking out rare meteorites for fun and profit?",
            "The ultimate space scavenger hunt: Can you find all the hidden Easter eggs on the space station?",
            "Searching for the perfect zero-G dance partner: Where to find someone who won't step on your toes?",
            "Space station hide and seek: Where's the best hiding spot in a place with no corners?",
            "Navigating the space-time continuum: Is there an app for that?",
            "The search for the perfect space souvenir: What's the most unique item you can bring back from orbit?",
            "Astronaut Tinder: Where to search for love in the cosmos?",
            "Space trivia night: Where to find the most obscure facts about the universe?",
            "Lost in space: How to find your way back to the space station after a spacewalk?",
            "The quest for the ultimate space snack: Can you search for the perfect combination of taste and zero-G friendliness?",
            "Hunting for shooting stars: Where's the best spot on the spacecraft for stargazing?",
            "Searching for the meaning of life in the vastness of space: Is it hiding in a black hole or behind a comet?"
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }, []);


    return (
        <InputGroup size="lg" className={'search-input'}>
            <InputLeftElement pointerEvents='none'>
                {animationState === AnimationState.Running ?
                    <Spinner
                        size="xs"
                        color={
                            isSearchFocused ? iconColors : 'var(--chakra-colors-chakra-border-color)'
                        }/>
                    :
                    <SearchIcon
                        style={tr}
                        color={
                            isSearchFocused ? iconColors : 'var(--chakra-colors-chakra-border-color)'
                        }
                    />}
            </InputLeftElement>
            <Input
                onBlur={() => setIsSearchFocused(false)}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                color={searchTextColor}
                borderBottomRadius={animationState === AnimationState.Finished ? '0' : 'md'}
                bg={searchBg}
                ref={searchBoxRef}
                id="hyper-search"
                fontSize={"1rem"}
                size="lg"
                placeholder={returnRandomMessage()}
            />
            {
                 <InputRightElement pointerEvents='none' width={isSearchFocused && animationState === AnimationState.Finished ? '8rem' : '5.5rem'}>
                     {
                         !isSearchFocused && <div>
                             <Kbd>
                                 {
                                     isMac ? '⌘' : 'alt'
                                 }
                             </Kbd> + <Kbd>K</Kbd>
                         </div>
                     }
                     {
                         isSearchFocused && animationState === AnimationState.Finished && <Badge
                                colorScheme="green"
                                variant="subtle">
                             Took: {extraSearchResultData.executionTime.took}
                         </Badge>
                     }


                </InputRightElement>
            }
        </InputGroup>
    );
}

export default SearchBar;
