import React, {useEffect, useState} from "react";
import {WebsocketState, WebsocketStoreState} from "../stores/websocketStore";
import {Alert, AlertTitle, Button, chakra, useToast} from "@chakra-ui/react";
import useAnimationReset from "./useAnimationReset";

export default function (states: WebsocketStoreState['states'], actions: WebsocketStoreState['actions']) {
    const toast = useToast();
    const {resetAnimations} = useAnimationReset();
    const [runOnce, setRunOnce] = useState(false);

    useEffect(() => {
        setRunOnce(true);
    }, []);

    useEffect(() => {
        let alert = (<></>);
        let time = 1500;

        if (states.state === WebsocketState.Disconnected) {
            toast.closeAll();
            time = 99999;
            alert = (
                <Alert status="error" borderRadius={'5rem'} top={'5rem'}>
                    <AlertTitle>
                        <chakra.span marginRight={"1rem"}>❌️</chakra.span>
                        The connection to our server has been lost!
                    </AlertTitle>
                    <Button onClick={() => actions.reconnect()}> Reconnect </Button>
                </Alert>
            );

            resetAnimations();

            toast({
                duration: time,
                position: "top",
                render: () => (alert),
                isClosable: true,
                id: 'websocket-disconnected'
            });
        }

        if (states.state === WebsocketState.Connecting) {
            toast.closeAll();

            alert = (
                <Alert status="info" borderRadius={'5rem'} top={'5rem'}>
                    <AlertTitle>
                        <chakra.span marginRight={"1rem"}>⏱️</chakra.span>
                        Connecting to our server...
                    </AlertTitle>
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

        if (states.state === WebsocketState.Connected) {
            toast.closeAll();

            alert = (
                <Alert status="success" borderRadius={'5rem'} top={'5rem'}>
                    <AlertTitle>
                        <chakra.span marginRight={"1rem"}>✅</chakra.span>
                        Connection to server established!
                    </AlertTitle>
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
    }, [states.state, runOnce]);
}
