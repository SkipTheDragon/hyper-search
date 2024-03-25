import mapWsStateToStoreState from "./mapWsStateToStoreState";
import { WebsocketStoreState} from "../stores/websocketStore";
import {createStore} from "zustand";

/**
 * Create a new WebSocket connection and binds all the necessary events to the WebSocket before adding it to the store.
 * @param store
 */
export default function createWs(store: any|ReturnType<typeof createStore<WebsocketStoreState>>) {
    const mStore = store.getState();

    const socket = new WebSocket(window.config.app.websocket)

    mStore._internals._setSocketStatus(mapWsStateToStoreState(socket.readyState));
    socket.onclose = () => mStore._internals._setSocketStatus(mapWsStateToStoreState(socket.readyState));
    socket.onopen = () => mStore._internals._setSocketStatus(mapWsStateToStoreState(socket.readyState));
    socket.onerror = () => mStore._internals._setSocketStatus(mapWsStateToStoreState(socket.readyState));

    socket.onmessage = (event) => {
        mStore.actions.saveResult(JSON.parse(event.data))
    };

    store.setState(
        {
            ...mStore,
            states: {
                ...mStore.states,
                socket: socket
            }
        }
    )
}
