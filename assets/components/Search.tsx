import {
    Alert,
    AlertTitle,
    Button,
    ChakraBaseProvider,
    ColorModeScript,
    Container,
    Fade,
    Flex,
    Stack,
    Text, ToastId,
    usePrefersReducedMotion, useToast,
} from '@chakra-ui/react';
import theme from "../theme/theme";
import React, {useContext, useEffect, useRef, startTransition} from "react";
import SearchBar from "../components/SearchBar";
import Result from "../components/Result";
import Header from "../components/Header";
import StarsScene from "../functions/animations/stars/StarsScene";
import {AnimationState, SearchBoxState, SearchState, useAnimationStore} from "../stores/animationStore";

export default function Search() {
    const reducedMotion = usePrefersReducedMotion();
    const animationStore = useAnimationStore();
    const canvasRef = useRef(null)

    const tr = {
        transitionProperty: "var(--chakra-transition-property-common)",
        transitionDuration: "var(--chakra-transition-duration-normal)"
    }

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

        startTransition(() => {
            // If the user is searching, animate the background.
            if (animationStore.states.search === SearchState.Searching) {
                animationStore.animation.start();
                stars.animate();
            }
        });

            // If the search stopped, stop the animation.
            if (animationStore.states.search === SearchState.Finished) {
                // Add a delay so the animation doesn't end too fast.
                setTimeout(() => {
                    startTransition(() => {
                        animationStore.animation.finish();
                    });
                }, 5000);
            }

    }, [animationStore.states.search, canvasRef, reducedMotion]);

    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <ChakraBaseProvider theme={theme}>
                <Container maxW={'5xl'}>
                    <Stack
                        transition={'margin-top 0.2s ease-in-out'}
                        marginTop={animationStore.states.animation === AnimationState.Finished ? '0' : '20vh'}
                        textAlign="center"
                        spacing={{base: 8, md: 14}}
                        py={{base: 20, md: 36}}>
                        <Header tr={tr}/>
                        <Container
                            transition={'max-width 0.2s ease-in-out'}
                            maxW={animationStore.states.searchBox === SearchBoxState.Focused || animationStore.states.search !== SearchState.Waiting ? '4xl' : '2xl'}>
                            <Flex direction={'column'}>
                                <SearchBar tr={tr}/>
                                <Result/>
                            </Flex>
                        </Container>
                        <Fade
                            in={animationStore.states.search === SearchState.Waiting}>
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
                    visibility: animationStore.states.animation !== AnimationState.NotRunning ? 'visible' : 'hidden',
                    opacity: animationStore.states.animation !== AnimationState.NotRunning ? '1' : '0',
                    zIndex: -1,
                    filter: "brightness(0.8)"
                }} id="bg"/>
            </ChakraBaseProvider>
        </>
    );
}

