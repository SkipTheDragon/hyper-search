import {Heading, Text, useColorModeValue} from "@chakra-ui/react";
import React from "react";
import {ExtraData} from "../pages/search";
import {chakra} from "@chakra-ui/react";
import {AnimationState, SearchState, useAnimationStore} from "../stores/animationStore";
import {useWebsocketStore} from "../stores/websocketStore";

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
                                websocketStore.states.lastMessage?.extraData.total > 0 ?
                                    <>
                                        <chakra.span color={'green.400'}>
                                            {websocketStore.states.lastMessage?.extraData.total} matching {websocketStore.states.lastMessage?.extraData.total > 1 ? 'results' : 'result'}  found.
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
