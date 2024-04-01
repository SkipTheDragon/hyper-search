import {chakra, Fade, Input, ScaleFade, SlideFade, Stack, useColorModeValue} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import SearchHistoryItem from "./SearchHistoryItem";


export default function () {
    const [visibleHistory, setVisibleHistory] = useState([]);
    const [lastArrayElementKey, setLastArrayElementKey] = useState(0);
    const element = useRef<HTMLDivElement | null>(null);
    const [historyChanging, changeHistory] = useState<boolean>(true);
    const searches = 6;

    function checkScrollDirectionIsUp(event: WheelEvent) {
        if (event.deltaY) {
            return event.deltaY > 0;
        }
        return event.deltaY < 0;
    }

    const fullHistory = new Array(100).fill(0, 0, 100).map((e, i) => {
        return {
            "id": i,
            "type": "SEARCH_QUERY",
            "payload": {
                "term": "test " + i
            }
        }
    });

    // Natural scroll for macos
    function scrollItems(event: WheelEvent) {
        const arrayTmp = fullHistory;
        let direction = 1;
        let end = lastArrayElementKey + direction;
        let start = lastArrayElementKey - ((searches - 1) * direction);

        // On scroll down add to visibleHistory and remove last element
        if (!checkScrollDirectionIsUp(event)) {
            direction = -1;
            end = lastArrayElementKey + direction;
            start = lastArrayElementKey + ((searches + 1) * direction);
        }

        changeHistory(false);

        setTimeout(() => {
            if (start < 0) {
                setVisibleHistory(arrayTmp.slice(0, searches));
                setLastArrayElementKey(searches);
            } else if (end > arrayTmp.length) {
                setVisibleHistory(arrayTmp.slice(arrayTmp.length - searches, arrayTmp.length));
                setLastArrayElementKey(arrayTmp.length);
            } else {
                setVisibleHistory(arrayTmp.slice(start, end));
                setLastArrayElementKey(end);
            }

            changeHistory(true);

        }, 1000)
    }

    useEffect(() => {
        if (element.current == null) {
            return;
        }

        element.current?.addEventListener('wheel', scrollItems);

        return () => element.current?.removeEventListener('wheel', scrollItems);
    }, [element.current, lastArrayElementKey])


    useEffect(() => {
        const start = fullHistory.length - searches;
        // Get the last 6 items from the history
        setVisibleHistory(fullHistory.slice(start, fullHistory.length));
        setLastArrayElementKey(fullHistory.length);
    }, []);

    return (
        <Stack
            ref={element}
            textAlign="center"
            py={{base: 20, md: 36}}
        >
            {
                visibleHistory && visibleHistory.map((historyItem, key) =>
                    <SearchHistoryItem
                        key={historyItem.id}
                        sizeKey={key}
                        historyChanging={historyChanging}
                        historyItem={historyItem}
                        searches={searches}
                    />
                )
            }
            <chakra.h4
                color={'gray.400'}
                fontSize={"0.9rem"}
                fontWeight={'bold'}
                borderBottom={'1px solid'}
                width={'30%'}
                textAlign="center"
                margin={'auto'}
                cursor={'pointer'}
                paddingBottom={'10px'}
                borderColor={'gray.200'}
            >
                Scroll Down/Up to see more
            </chakra.h4>
        </Stack>
    )
}
