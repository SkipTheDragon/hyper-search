import {
    Box,
    Container,
    Text,
    Stack,
    ChakraBaseProvider,
    Fade,
    Flex,
    usePrefersReducedMotion,
    ColorModeScript,
} from '@chakra-ui/react';
import theme from "../theme/theme";
import React, {useEffect, useRef} from "react";
import SearchBar from "../components/SearchBar";
import Result, {SearchResultProps} from "../components/Result";
import Header from "../components/Header";
import {useDebounce} from "use-debounce";
import StarsScene from "../functions/animations/stars/StarsScene";

export enum SearchState {
    Waiting,
    Searching,
    Finished,
}

export enum AnimationState {
    NotRunning,
    Running,
    Finished,
}
export interface ExtraData {
    status: string;
    executionTime: {
        took: string,
        tookRaw: number
    },
    suggestions: object,
    total: number
}
export default function CallToActionWithAnnotation() {
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);

    const [data, setData] = React.useState<SearchResultProps[]>([]);
    const [extraData, setExtraData] = React.useState<ExtraData>({
        status: "error",
        executionTime: {
            took: "0ms",
            tookRaw: 0
        },
        suggestions: [],
        total: 0
    });

    const [searchState, setSearchState] = React.useState(SearchState.Waiting);
    const [animationState, setAnimationState] = React.useState(AnimationState.NotRunning);

    const [reactiveValue, setReactiveValue] = React.useState("")
    const [value] = useDebounce(reactiveValue, 1000);

    const tr = {
        transitionProperty: "var(--chakra-transition-property-common)",
        transitionDuration: "var(--chakra-transition-duration-normal)"
    }

    const canvasRef = useRef(null)
    const reducedMotion = usePrefersReducedMotion();

    const [socket, setSocket] = React.useState<WebSocket|null>(null);

    // Connect to the WebSocket server
    useEffect(() => {
        const newSocket =  new WebSocket(window["config"].app.websocket);
        setSocket(newSocket);


        return () => {
            newSocket.close();
        };
    }, []);

    // Add searching animation to the background
    useEffect(() => {
        // If the user has requested reduced motion, don't animate.
        if (reducedMotion) return;

        document.body.style.transition = 'background-color 0.2s ease-in-out';

        if (canvasRef.current === null) {
            console.error("Canvas is not an instance of HTMLCanvasElement, cannot render searching animation.")
            return;
        }

        const stars = new StarsScene(canvasRef.current);

        // If the user is searching, animate the background.
        if (searchState === SearchState.Searching) {
            setAnimationState(AnimationState.Running);
            stars.animate();
        }

        // If the search stopped, stop the animation.
        if (searchState === SearchState.Finished) {
            // Add a delay so the animation doesn't end too fast.
            setTimeout(() => {
                setAnimationState(AnimationState.Finished);
            }, 5000);
        }
    }, [value, isSearchFocused, animationState, searchState, canvasRef, reducedMotion]);

    // Listen for messages from the WebSocket server
    useEffect(() => {
        if (socket) {
            // Listen for messages from the WebSocket server
            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                setSearchState(SearchState.Finished);

                setExtraData({
                    status: response.status,
                    ...response.extraData
                });
                setData(response.data);
            };
        }
    }, [socket]);

    // Send the search query to the WebSocket server
    useEffect(() => {
        if (value.length < 1) return;

        if (socket) {
            socket.send(value);
            setSearchState(SearchState.Searching);
        }
    }, [value,socket]);

    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <ChakraBaseProvider theme={theme}>
                <Container maxW={'5xl'}>
                    <Stack
                        transition={'margin-top 0.2s ease-in-out'}
                        marginTop={animationState === AnimationState.Finished ? '0' : '20vh' }
                        textAlign="center"
                        spacing={{base: 8, md: 14}}
                        py={{base: 20, md: 36}}>
                        <Header
                            searchState={searchState}
                            animationState={animationState}
                            extraSearchResultData={extraData}
                            tr={tr}
                        />
                        <Container
                            transition={'max-width 0.2s ease-in-out'}
                            maxW={isSearchFocused || searchState ? '4xl' : '2xl'}>
                            <Flex direction={'column'}>
                                <SearchBar animationState={animationState}
                                           isSearchFocused={isSearchFocused}
                                           setIsSearchFocused={setIsSearchFocused}
                                           setValue={setReactiveValue}
                                           extraSearchResultData={extraData}
                                           value={reactiveValue} tr={tr}/>
                                <Result data={data}
                                        animationState={animationState}
                                        extraSearchResultData={extraData}
                                        setReactiveValue={setReactiveValue}
                                />
                            </Flex>
                        </Container>
                        <Fade in={!isSearchFocused && !searchState}>
                            <Text color={'gray.500'} width="75%" margin="auto">
                                Query enables fast searches across our documentations, knowledge bases, tickets, and
                                forums. Instantly access relevant information with an efficient interface, making it
                                easy to
                                find answers, solutions, and discussions in one place.
                            </Text>
                        </Fade>
                    </Stack>
                </Container>
                    <canvas ref={canvasRef} style={{
                        transition: 'all 0.2s ease-in-out',
                        visibility: animationState !== AnimationState.NotRunning ? 'visible' : 'hidden',
                        opacity: animationState !== AnimationState.NotRunning ? '1' : '0',
                        zIndex: -1,
                        filter: "brightness(0.8)"
                    }} id="bg"/>
            </ChakraBaseProvider>
        </>
    );
}

