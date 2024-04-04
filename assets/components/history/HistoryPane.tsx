import {chakra, Stack} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import SearchHistoryItem from "./SearchHistoryItem";
import {Message} from "../../types/ws/messages/Message";
import {SearchPayload} from "../../types/ws/messages/payloads/SearchPayload";
import {useWebsocketStore} from "../../context/WebSocketContextProvider";
import {WebsocketStoreState} from "../../stores/websocketStore";
import {MessageTypes} from "../../types/ws/messages/MessageTypes";
import {useSettingsStore} from "../../stores/settingsStore";

function checkScrollDirectionIsUp(event: WheelEvent) {
    if (event.deltaY) {
        return event.deltaY > 0;
    }
    return event.deltaY < 0;
}
export const searchHistoryBoxesPerPage = 6;

export default function () {
    const [visibleHistory, setVisibleHistory] = useState<Message<SearchPayload>[]>([]);
    const [lastArrayElementKey, setLastArrayElementKey] = useState<number>(0);
    const element = useRef<HTMLDivElement | null>(null);
    const [historyChanging, changeHistory] = useState<boolean>(true);
    const [fullHistory, setFullHistory] = useState<Message<SearchPayload>[]>([]);
    const websocketHistory: Message<SearchPayload>[] = useWebsocketStore((store: WebsocketStoreState) => store.states.pastMessages).filter((message) => message.type === MessageTypes.SearchQuery);
    const fillHistory = useSettingsStore((store) => store.states.fillHistory);
    useEffect(() => {
        if (fillHistory) {
            setFullHistory(new Array(100).fill(0, 0, 100).map((e, i) => {
                return {
                    "id": i,
                    "type": "SEARCH_QUERY",
                    "payload": {
                        "term": "test " + i
                    }
                } as Message<SearchPayload>
            }))
        } else {
            setFullHistory(websocketHistory)
        }

    }, [fillHistory]);

    // Natural scroll for macos
    function scrollItems(event: WheelEvent) {
        const arrayTmp = fullHistory;
        let direction = 1;
        let end = lastArrayElementKey + direction;
        let start = lastArrayElementKey - ((searchHistoryBoxesPerPage - 1) * direction);

        // On scroll down add to visibleHistory and remove last element
        if (!checkScrollDirectionIsUp(event)) {
            direction = -1;
            end = lastArrayElementKey + direction;
            start = lastArrayElementKey + ((searchHistoryBoxesPerPage + 1) * direction);
        }

        changeHistory(false);

        setTimeout(() => {
            if (start < 0) {
                setVisibleHistory(arrayTmp.slice(0, searchHistoryBoxesPerPage));
                setLastArrayElementKey(searchHistoryBoxesPerPage);
            } else if (end > arrayTmp.length) {
                setVisibleHistory(arrayTmp.slice(arrayTmp.length - searchHistoryBoxesPerPage, arrayTmp.length));
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
        const start = fullHistory.length - searchHistoryBoxesPerPage;
        // Get the last 6 items from the history
        setVisibleHistory(fullHistory.slice(start, fullHistory.length));
        setLastArrayElementKey(fullHistory.length);
    }, [fullHistory]);

    return (
        <Stack
            ref={element}
            textAlign="center"
            py={{base: 16, md: 18}}
        >
            {
                visibleHistory && visibleHistory.map((historyItem, key) =>
                    <SearchHistoryItem
                        key={historyItem.id}
                        sizeKey={key}
                        historyChanging={historyChanging}
                        historyItem={historyItem}
                    />
                )
            }
        </Stack>
    )
}
