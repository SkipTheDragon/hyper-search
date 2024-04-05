import {createStore} from 'zustand'
import {createJSONStorage, persist, subscribeWithSelector} from "zustand/middleware";
import {createContext} from "react";
import createWs from "../functions/createWs";
import {Results} from "../types/ws/results/Results";
import {MappingResultsToType} from "../types/ws/results/MappingResultsToType";
import {Payloads} from "../types/ws/messages/payloads/Payloads";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import {Message} from "../types/ws/messages/Message";

export enum WebsocketState {
    Connecting,
    Connected,
    Disconnected,
    Uninitialized,
}

export interface WebsocketStoreState {
    states: {
        state: WebsocketState,
        socket: WebSocket | null,
        pastMessages: Message<any>[],
        pastResults: Results[],
        mappedResults: Partial<{
            [key in MessageTypes]: MappingResultsToType[key]
        }>;
        mappedMessages: Partial<{
            [key in MessageTypes]: Message<any>['payload']
        }>
    }
    actions: {
        reconnect: () => void,
        sendMessage: <T extends Payloads>(message: Message<T>) => void,
        saveResult: (result: Results) => void,
    },
    _internals: {
        _setSocketStatus: (status: WebsocketState) => void
    }
}

const indexedDb = window.indexedDB.open("HyperSearchDB", 3);
/**
 * Store for the websocket connection.
 */
export const createWebsocketStore = () => {

    const store = createStore<WebsocketStoreState>()(
        subscribeWithSelector(persist((set, get) => ({
                    states: {
                        state: WebsocketState.Uninitialized,
                        socket: null,
                        pastMessages: [],
                        pastResults: [],
                        mappedResults: {},
                        mappedMessages: {}
                    },
                    actions: {
                        reconnect: () => set((_store) => {
                            setTimeout(() => {
                                createWs(store)
                            }, 3000)

                            return {
                                states: {
                                    ..._store.states,
                                    state: WebsocketState.Connecting
                                }
                            };
                        }),
                        /**
                         * Send a message to the websocket server
                         * @param message
                         */
                        sendMessage: <T extends Payloads>(message: Message<T>) => set((store) => {

                            if (store.states.socket === null) {
                                throw new Error("Socket not initialized")
                            }

                            store.states.socket.send(JSON.stringify(message))

                            return {
                                states: {
                                    ...store.states,
                                    mappedMessages: {
                                        ...store.states.mappedMessages,
                                        [message.type]: message.payload
                                    },
                                    pastMessages: [...store.states.pastMessages, {
                                        id: store.states.pastMessages.length,
                                        ...message
                                    }],
                                }
                            };
                        }),
                        /**
                         * Save the result from the websocket message to the store
                         * @param result
                         */
                        saveResult:
                            (result) => set((store) => (
                                {
                                    states: {
                                        ...store.states,
                                        mappedResults: {
                                            ...store.states.mappedResults,
                                            [result.type]: result
                                        },
                                        pastResults: [...store.states.pastResults, {
                                            id: store.states.pastResults.length,
                                            ...result
                                        }],
                                    }
                                }
                            )),
                    },
                    _internals: {
                        /**
                         * Set the socket status
                         * @param state
                         */
                        _setSocketStatus: (state: WebsocketState) => set((store) => (
                            {
                                states: {
                                    ...store.states,
                                    state: state
                                }
                            }
                        )),
                    }
                }),
                {
                    name: 'websocket-storage',
                    storage: createJSONStorage(() => localStorage),
                    partialize: (state) => ({
                        states: {
                            state: WebsocketState.Uninitialized,
                            socket: null,
                            pastResults: [],
                            mappedResults: {},
                            mappedMessages: {},
                            pastMessages: state.states.pastMessages.filter((message) => message.type === MessageTypes.SearchQuery),
                        }
                    }),
                },
            ),
        )
    );

    // Create the websocket connection
    createWs(store)

    return store;
}


// @ts-ignore - This is a hack to get the store to work with the context.
export const WebSocketContext = createContext<ReturnType<typeof createWebsocketStore>>(createWebsocketStore)
