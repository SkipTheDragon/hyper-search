import {Heading, Text, useColorModeValue} from "@chakra-ui/react";
import React from "react";
import {AnimationState, ExtraData, SearchState} from "../pages/search";
import {chakra} from "@chakra-ui/react";

export interface HeaderProps {
    searchState: SearchState;
    animationState: AnimationState;
    tr: any;
    extraSearchResultData: ExtraData;
}

const Header: React.FC<HeaderProps> = (
    {
        searchState,
        animationState,
        tr,
        extraSearchResultData
    }
) => {
    const headingColorUnfocused = useColorModeValue(
        'black',
        'white'
    );

    return (
        <Heading
            style={tr}
            transition={'color 0.2s ease-in-out'}
            color={animationState !== AnimationState.NotRunning ?  'white' : headingColorUnfocused}
            fontWeight={600}
            fontSize={{base: '2xl', sm: '4xl', md: '6xl'}}
            lineHeight={'110%'}>
            {
                animationState === AnimationState.Running ?
                    <>
                        Hyper Searching Initiated... <br/>
                        <chakra.span color={'brand.400'}>
                            Searching the cosmos for you 🚀.
                        </chakra.span>
                    </>
                    :
                    searchState === SearchState.Finished &&  animationState === AnimationState.Finished  ?
                        <>
                           Search Finished!<br/>
                            {
                                extraSearchResultData.total > 0 ?
                                    <>
                                        <chakra.span color={'green.400'}>
                                            {extraSearchResultData.total} matching {extraSearchResultData.total > 1 ? 'results' : 'result'}  found.
                                        </chakra.span>
                                    </>
                                    :
                                    <>
                                        <chakra.span as={'span'} color={'red.400'}>
                                            No matching results found.
                                        </chakra.span>
                                    </>
                            }
                        </>
                        :
                    <>
                        Type something to initiate<br/>
                        <chakra.span color={'brand.400'}>
                            Hyper Searching
                        </chakra.span>
                    </>
            }
        </Heading>
    );
}

export default Header;
