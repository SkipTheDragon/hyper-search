import {WebSocketContext, WebsocketStoreState} from "../stores/websocketStore";
import {useContext} from "react";
import {StoreApi, useStore} from "zustand";

function useWebsocketStore<T>(selector ?: undefined): WebsocketStoreState
function useWebsocketStore<T>(selector ?: (state: WebsocketStoreState) => T): T
function useWebsocketStore<T = WebsocketStoreState>(selector ?: (state: WebsocketStoreState) => T): T|WebsocketStoreState {
    const store = useContext(WebSocketContext)
    if (!store) {
        throw new Error('Missing WebsocketStoreProvider')
    }

    if (!selector) {
        return useStore(store, (state) => state);
    }

    return useStore(store, selector);
}

export default useWebsocketStore;
