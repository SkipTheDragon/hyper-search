import React, {ReactNode, useContext, useEffect, useRef, useState} from "react";
import {createWebsocketStore, WebSocketContext, WebsocketState, WebsocketStoreState} from "../stores/websocketStore";
import {Alert, AlertTitle, Button, useToast, chakra} from "@chakra-ui/react";
import {useAnimationStore} from "../stores/animationStore";
import {StoreApi, useStore} from "zustand";
import ArgumentsOf = jest.ArgumentsOf;


export default function WebSocketContextProvider({children}: { children: ReactNode }) {
    const storeRef = useRef<ReturnType<typeof createWebsocketStore>>()

    if (!storeRef.current) {
        storeRef.current = createWebsocketStore();
    }

    const [state, setState] = useState(storeRef.current.getState().states.state)

    const toast = useToast();

    const store = storeRef.current.getState();
    const animationStore = useAnimationStore();

    storeRef.current.subscribe((currentStore, prevStore) => {
        setState(currentStore.states.state)

        if (currentStore.states.pastResults.length !== prevStore.states.pastResults.length) {
            animationStore.search.finish()
        }
    })

    useEffect(() => {
        let alert = (<></>);
        let time = 1500;

        if (store.states.state === WebsocketState.Disconnected) {
            toast.closeAll();
            time = 99999;
            alert = (
                <Alert status="error" borderRadius={'5rem'} top={'5rem'}>
                    <AlertTitle>
                        <chakra.span marginRight={"1rem"}>❌️</chakra.span>
                        The connection to our server has been lost! </AlertTitle>
                    <Button onClick={() => store.actions.reconnect()}> Reconnect </Button>
                </Alert>
            );

            toast({
                duration: time,
                position: "top",
                render: () => (alert),
                isClosable: true,
                id: 'websocket-disconnected'
            });
        }

        if (store.states.state === WebsocketState.Connecting) {
            toast.closeAll();

            alert = (
                <Alert status="info" borderRadius={'5rem'} top={'5rem'}>
                    <AlertTitle>
                        <chakra.span marginRight={"1rem"}>⏱️</chakra.span>
                        Connecting to our server... </AlertTitle>
                </Alert>
            );

            toast({
                duration: time,
                position: "top",
                render: () => (alert),
                isClosable: true,
                id: 'websocket-connecting'
            });
        }

        if (store.states.state === WebsocketState.Connected) {
            toast.closeAll();

            alert = (
                <Alert status="success" borderRadius={'5rem'} top={'5rem'}>
                    <AlertTitle>
                        <chakra.span marginRight={"1rem"}>✅</chakra.span>
                        Connection to server established! </AlertTitle>
                </Alert>
            );


            toast({
                duration: time,
                position: "top",
                render: () => (alert),
                isClosable: true,
                id: 'websocket-connected'
            });
        }
    }, [state]);

    return (
        <WebSocketContext.Provider value={storeRef.current}>
            {children}
        </WebSocketContext.Provider>
    )
}

type SelectorType = Parameters<typeof useStore<StoreApi<WebsocketStoreState>, WebsocketStoreState>>[1];

export const useWebsocketStore = (selector: SelectorType) => {
    const store = useContext(WebSocketContext)
    if (!store) {
        throw new Error('Missing WebsocketStoreProvider')
    }
    return useStore(store, selector)
}
