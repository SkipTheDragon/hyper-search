import {Input, InputGroup, InputLeftElement, Spinner, useColorModeValue} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import React, {FC, useRef} from "react";

export interface SearchBarProps {
    isWarpStarted: boolean;
    isSearchFocused: boolean;
    setIsSearchFocused: (val: boolean) => void;
    setValue: (val: string) => void
    value: string;
    tr: any;
}

const SearchBar: React.FC<SearchBarProps> = (
    {
        isWarpStarted,
        isSearchFocused,
        setIsSearchFocused,
        setValue,
        value,
        tr
    }) => {

    const searchBoxRef = useRef(null)
    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');
    const iconColors = useColorModeValue('gray.700', 'navy.100');

    return (
        <InputGroup size="lg" className={'search-input'}>
            <InputLeftElement pointerEvents='none'>
                {isWarpStarted ?
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
                borderBottomRadius={isWarpStarted ? '0' : 'md'}
                bg={searchBg}
                ref={searchBoxRef}
                id="hyper-search"
                size="lg"
                placeholder='Type here...'/>
        </InputGroup>
    );
}

export default SearchBar;
