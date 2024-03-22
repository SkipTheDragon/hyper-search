import {create} from 'zustand'
import {subscribeWithSelector} from "zustand/middleware";
import {SearchState} from "./animationStore";

export enum WebsocketState {
    Uninitialized,
    Connected,
    Disconnected,
}

export interface WebsocketStoreState {
    states: {
        state: WebsocketState,
        socket: WebSocket,
        lastMessage: Data | null,
        pastMessages: Data[],
    }
    actions: {
        searchQuery: (term: string) => void,
        saveReply: (socketReply: Data) => void,
    },
    _internals: {
        _setSocketStatus: (status: WebsocketState) => void
        _init: () => void
    }
}

export enum MessageTypes {
    SearchQuery,
    SuggestionsQuery
}

interface Data {
    status: "success" | "error",
    message?: string,
    data?: {
        _id: string;
        _score: number;
        _source: {
            description: string;
            title: string;
            location: string;
            link: string;
        }
    }[],
    extraData: {
        executionTime: {
            took: string,
            tookRaw: number
        },
        suggestions: object,
        total: number
    },
}

export const useWebsocketStore = create<WebsocketStoreState>()(
    subscribeWithSelector((set, get) => ({
        states: {
            state: WebsocketState.Uninitialized,
            socket: new WebSocket(window["config"].app.websocket),
            lastMessage: null,
            pastMessages: [],
        },
        actions: {
            searchQuery: (term: string) => {
                const store = get();

                // Bind event listeners on socket
                if (store.states.state === WebsocketState.Uninitialized) {
                    store._internals._init()
                }

                store.states.socket.send(term)

                return store;
            },
            saveReply:
                (socketReply) => set((store) => (
                    {
                        ...store,
                        states: {
                            ...store.states,
                            lastMessage: socketReply,
                            pastMessages: [...store.states.pastMessages, socketReply],
                        }
                    }
                )),
        },
        _internals: {
            _init: () => {
                const store = get();

                // If the socket is already initialized before we add the listener
                if (store.states.socket.readyState === 1 && store.states.state === WebsocketState.Uninitialized) {
                    store._internals._setSocketStatus(WebsocketState.Connected);
                }

                // Add the listener just in case.
                store.states.socket.addEventListener('open', () => {
                    store._internals._setSocketStatus(WebsocketState.Connected);
                })

                for (const event of ['ErrorEvent', 'CloseEvent']) {
                    store.states.socket.addEventListener(event, () => {
                        store._internals._setSocketStatus(WebsocketState.Disconnected);
                    })
                }
            },
            _setSocketStatus: (state: WebsocketState) => set((store) => (
                {
                    ...store,
                    states: {
                        ...store.states,
                        state: state
                    }
                }
            )),
        }
    }))
)
