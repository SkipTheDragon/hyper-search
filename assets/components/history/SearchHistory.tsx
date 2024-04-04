import {chakra, Fade, ScaleFade, useColorModeValue} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {AnimationState, SearchHistoryState, useAnimationStore} from "../../stores/animationStore";
import HistoryPane, {searchHistoryBoxesPerPage} from "./HistoryPane";
import {Message} from "../../types/ws/messages/Message";
import {SearchPayload} from "../../types/ws/messages/payloads/SearchPayload";
import {useWebsocketStore} from "../../context/WebSocketContextProvider";
import {WebsocketStoreState} from "../../stores/websocketStore";
import {MessageTypes} from "../../types/ws/messages/MessageTypes";
import {useSettingsStore} from "../../stores/settingsStore";

export default function SearchHistory() {
    const {searchHistory} = useAnimationStore();
    const searchHistoryState = useAnimationStore((store) => store.states.searchHistory);
    const websocketHistory: Message<SearchPayload>[] = useWebsocketStore((store: WebsocketStoreState) => store.states.pastMessages).filter((message) => message.type === MessageTypes.SearchQuery);
    const isActive = searchHistoryState === SearchHistoryState.Active;
    const fillHistory = useSettingsStore((store) => store.states.fillHistory);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        if (fillHistory) {
            setTotal(100);
        } else {
            setTotal(websocketHistory.length)
        }
    }, [fillHistory])

    const headingColorUnfocused = useColorModeValue(
        'black',
        'white'
    );

    const state = () => {
        if (!isActive) return {};

        return {
            color: headingColorUnfocused,
            fontWeight: 600,
            fontSize: {base: '2xl', sm: '4xl', md: '6xl'},
            lineHeight: '110%',
            width: '100%',
            borderBottom: '0'
        }
    }

    return (
        <chakra.div
            transition={'all 0.5s ease-in-out'}
            position={isActive ? 'relative' : "fixed"}
            bottom={isActive ? 'unset' : '0'}
            left={0}
            right={0}
            cursor={'pointer'}
            width={isActive ? 'auto' : '70vw'}
            marginTop={isActive ? '30vh' : '100vh'}
            marginX={'auto'}
        >
            <chakra.h4
                color={'gray.400'}
                fontSize={"0.9rem"}
                fontWeight={'bold'}
                onClick={() => searchHistory.activate()}
                borderBottom={'1px solid'}
                width={'30%'}
                textAlign="center"
                margin={'auto'}
                paddingBottom={'10px'}
                borderColor={'gray.200'}
                {...state()}
            >
                Past Search Queries <br/>

                <chakra.span color={'brand.400'}>
                    {isActive ?
                        <>Showing {total < searchHistoryBoxesPerPage ? total : searchHistoryBoxesPerPage} out
                            of {total} queries.</> :
                        'Click here to view.'
                    }
                </chakra.span>
            </chakra.h4>

            <Fade in={isActive} unmountOnExit={true}>
                {
                    total === 0 ?
                        <chakra.h4 color={'gray.400'} marginTop={'2rem'} textAlign="center">No search queries
                            found.</chakra.h4>
                        :
                        <HistoryPane/>
                }

                <chakra.div
                    position="fixed"
                    bottom={0}
                    left={0}
                    right={0}
                    marginTop='100vh'
                >
                    <chakra.h4
                        onClick={() => searchHistory.deactivate()}
                        color={'gray.400'}
                        fontSize={"0.9rem"}
                        fontWeight={'bold'}
                        borderBottom={'1px solid'}
                        textAlign="center"
                        margin={'auto'}
                        cursor={'pointer'}
                        paddingBottom={'10px'}
                        borderColor={'gray.200'}
                        marginTop={'100px'}
                    >
                        Scroll Down/Up to see more <br/>
                        <chakra.span color={'brand.400'}>
                            Or click here to go back
                        </chakra.span>
                    </chakra.h4>
                </chakra.div>
            </Fade>
        </chakra.div>
    );
}
