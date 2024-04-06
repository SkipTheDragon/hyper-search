import {useEffect, useState} from "react";
import {Message} from "../types/ws/messages/Message";
import {SearchPayload} from "../types/ws/messages/payloads/SearchPayload";
import {searchHistoryBoxesPerPage} from "../components/history/HistoryPane";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import {useSettingsStore} from "../stores/settingsStore";
import checkScrollDirectionIsUp from "../functions/checkScrollDirectionIsUp";
import useWebsocketStore from "./useWebsocketStore";

export default function (element: HTMLDivElement | null) {
    const [visibleHistory, setVisibleHistory] = useState<Message<SearchPayload>[]>([]);
    const [historyChanging, changeHistory] = useState<boolean>(true);
    const [fullHistory, setFullHistory] = useState<Message<SearchPayload>[]>([]);
    const pastMessages= useWebsocketStore((store) => store.states.pastMessages)
    const websocketHistory = pastMessages.filter((message) => message.type === MessageTypes.SearchQuery);

    const fillHistory = useSettingsStore((store) => store.states.fillHistory);
    const [lastArrayElementKey, setLastArrayElementKey] = useState<number>(0);

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
        if (element !== null) {
            element.addEventListener('wheel', scrollItems);
            return () => element.removeEventListener('wheel', scrollItems);
        }
    }, [element, lastArrayElementKey])

    useEffect(() => {
        const start = fullHistory.length - searchHistoryBoxesPerPage;

        // Get the last 6 items from the history
        if (fullHistory.length > searchHistoryBoxesPerPage) {
            setVisibleHistory(fullHistory.slice(start, fullHistory.length));
        } else {
            setVisibleHistory(fullHistory);
        }

        setLastArrayElementKey(fullHistory.length);
    }, [fullHistory]);

    return {
        visibleHistory,
        historyChanging
    }
}
