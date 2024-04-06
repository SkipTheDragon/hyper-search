import React, {ReactNode, useRef, useState} from "react";
import {createWebsocketStore, WebSocketContext, WebsocketStoreState} from "../stores/websocketStore";
import {SearchState, useAnimationStore} from "../stores/animationStore";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import useWebsocketStateAlert from "../hooks/useWebsocketStateAlert";


export default function WebSocketContextProvider({children}: { children: ReactNode }) {
    const storeRef = useRef<ReturnType<typeof createWebsocketStore>>()

    if (!storeRef.current) {
        storeRef.current = createWebsocketStore();
    }

    const animationStore = useAnimationStore();

    // States from the store do not update in real-time, so we need to use local state to force a re-render.
    const [localState, setLocalState] = useState<WebsocketStoreState['states']>(storeRef.current.getState().states);

    storeRef.current.subscribe((currentStore, prevStore) => {
        setLocalState(currentStore.states);
        if (
            currentStore.states.pastResults.filter(r => r.type === MessageTypes.SearchQuery).length >
            prevStore.states.pastResults.filter(r => r.type === MessageTypes.SearchQuery).length &&
            animationStore.states.search === SearchState.Searching
        ) {
            animationStore.search.finish()
        }
    })

    useWebsocketStateAlert(localState, storeRef.current.getState().actions);

    return (
        <WebSocketContext.Provider value={storeRef.current}>
            {children}
        </WebSocketContext.Provider>
    )
}
