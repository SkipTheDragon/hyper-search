import {chakra, Heading, useColorModeValue} from "@chakra-ui/react";
import React from "react";
import {AnimationState, SearchState, useAnimationStore} from "../../stores/animationStore";
import useWebsocketStore from "../../hooks/useWebsocketStore";

export interface HeaderProps {
    tr: any;
}

const Header: React.FC<HeaderProps> = (
    {
        tr,
    }
) => {
    const animationStore = useAnimationStore();
    const websocketStore = useWebsocketStore();

    const headingColorUnfocused = useColorModeValue(
        'black',
        'white'
    );

    const total = websocketStore.states.mappedResults.SEARCH_QUERY?.extra?.total;

    return (
        <Heading
            style={tr}
            transition={'color 0.2s ease-in-out'}
            color={animationStore.states.animation !== AnimationState.NotRunning ?  'white' : headingColorUnfocused}
            fontWeight={600}
            fontSize={{base: '2xl', sm: '4xl', md: '6xl'}}
            lineHeight={'110%'}>
            {
                animationStore.states.animation === AnimationState.Running ?
                    <>
                        Hyper Searching Initiated... <br/>
                        <chakra.span color={'brand.400'}>
                            Searching the cosmos for you 🚀.
                        </chakra.span>
                    </>
                    :
                    animationStore.states.search === SearchState.Finished &&  animationStore.states.animation === AnimationState.Finished  ?
                        <>
                           Search Finished!<br/>
                            {
                                total !== undefined && total > 0  ?
                                    <>
                                        <chakra.span color={'green.400'}>
                                            {total} matching {total > 1 ? 'results' : 'result'}  found.
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
