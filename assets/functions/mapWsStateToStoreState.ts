import {WebsocketState} from "../stores/websocketStore";

/**
 * Map the WebSocket state to the createWebsocketStore' state
 * @param readyState
 */
export default function mapWsStateToStoreState(readyState: number) {
    if (readyState === WebSocket.CONNECTING) {
        return WebsocketState.Connecting;
    }

    if (readyState === WebSocket.OPEN) {
        return WebsocketState.Connected;
    }

    if (readyState === WebSocket.CLOSED || readyState === WebSocket.CLOSING) {
        return WebsocketState.Disconnected;
    }
}
