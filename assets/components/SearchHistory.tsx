import {chakra, Fade, ScaleFade} from "@chakra-ui/react";
import React from "react";
import {SearchHistoryState, useAnimationStore} from "../stores/animationStore";
import HistoryPane from "./HistoryPane";

export default function SearchHistory() {
    const {searchHistory} = useAnimationStore();
    const searchHistoryState = useAnimationStore((store) => store.states.searchHistory);

    const isActive = searchHistoryState === SearchHistoryState.Active;

    const toggleState = () => {
        if (searchHistoryState === SearchHistoryState.Active) {
            searchHistory.deactivate();
        } else {
            searchHistory.activate();
        }
    }

    return (
        <chakra.div
            transition={'all 0.2s ease-in-out'}
            position={isActive ? 'relative' : "fixed"}
            bottom={isActive ? 'unset' : '0'}
            left={0}
            right={0}
            width={isActive ? 'auto' : '70vw'}
            marginTop={isActive ? '20vh' : '100vh' }
            marginX={'auto'}
        >
            <chakra.h4
                color={'gray.400'}
                fontSize={"0.9rem"}
                fontWeight={'bold'}
                onClick={toggleState}
                borderBottom={'1px solid'}
                width={'30%'}
                textAlign="center"
                margin={'auto'}
                cursor={'pointer'}
                paddingBottom={'10px'}
                borderColor={'gray.200'}
            >
                PAST SEARCH QUERIES
            </chakra.h4>

            <Fade in={isActive} unmountOnExit={true}>
                <HistoryPane/>
            </Fade>
        </chakra.div>
    );
}
