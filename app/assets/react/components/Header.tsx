import {Heading, Text, useColorModeValue} from "@chakra-ui/react";
import React from "react";

export interface HeaderProps {
    isWarpStarted: boolean;
    isSearchFocused: boolean;
    tr: any;
}

const Header : React.FC<HeaderProps> = (
    {
        isSearchFocused,
        isWarpStarted,
        tr,
    }
) => {
    const headingColorUnfocused = useColorModeValue('black', 'white');

    return (
        <Heading
            style={tr}
            transition={'color 0.2s ease-in-out'}
            color={(isSearchFocused || isWarpStarted ? 'white' : headingColorUnfocused)}
            fontWeight={600}
            fontSize={{base: '2xl', sm: '4xl', md: '6xl'}}
            lineHeight={'110%'}>
            {
                isWarpStarted ? <>
                    Hyper Searching<br/>
                    <Text as={'span'} color={'brand.400'}>
                        Initiated!
                    </Text>
                </> : <>Type something to initiate<br/>
                    <Text as={'span'} color={'brand.400'}>
                        hyper-searching
                    </Text></>
            }
        </Heading>
    );
}

export default Header;
