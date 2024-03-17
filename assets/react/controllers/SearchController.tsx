import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    Icon,
    useColorModeValue,
    createIcon,
    ChakraBaseProvider,
    Input,
    InputLeftElement,
    InputGroup,
    Fade,
    Slide,
    Spinner,
    Collapse,
    Flex,
    GridItem,
    Grid, usePrefersReducedMotion, ColorModeScript,
} from '@chakra-ui/react';
import theme from "../theme/theme";
import React, {useEffect, useRef} from "react";
import {ChatIcon, CopyIcon, EmailIcon, LinkIcon, Search2Icon, SearchIcon} from "@chakra-ui/icons";
import renderSpaceWrapDrive2 from "../functions/renderSpaceWrapDrive2";
import NotFound from "../components/NotFound";
import Bar from '../components/Bar';
import {useColorMode} from "@chakra-ui/color-mode/dist/color-mode-context";
import SearchBar from "../components/SearchBar";
import Result, {ResultProps, SearchResultProps} from "../components/Result";
import Header from "../components/Header";
import {useDebounce} from "use-debounce";

export default function CallToActionWithAnnotation() {
    const [isWarpStarted, setIsWarpStarted] = React.useState(false);
    const [warpObject, setWarpObject] = React.useState(null);
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    const [data, setData] = React.useState<SearchResultProps[]>([]);

    const [reactiveValue, setReactiveValue] = React.useState("")
    const [value] = useDebounce(reactiveValue, 1000);

    const tr = {
        transitionProperty: "var(--chakra-transition-property-common)",
        transitionDuration: "var(--chakra-transition-duration-normal)"
    }
    const canvasRef = useRef(null)
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        document.body.style.transition = 'background-color 0.2s ease-in-out';

        if (reactiveValue.length > 1 && !isWarpStarted && !reducedMotion) {
            //@ts-ignore
            setWarpObject(new renderSpaceWrapDrive2(canvasRef.current));
            setIsWarpStarted(true);
        } else if (reactiveValue.length < 1 && isWarpStarted) {
            const canvas = canvasRef.current;
            if (canvas === null) return;
            // @ts-ignore
            const ctx = canvas.getContext("2d");
            ctx.reset();
            setWarpObject(null);
            setIsWarpStarted(false)
        }
    }, [value, isWarpStarted, isSearchFocused]);

    useEffect(() => {
        const socket = new WebSocket("ws://ws.lndo.site"); // TODO: CHANGE WITH HOST

        socket.addEventListener("open", function() {
            console.log("CONNECTED");
        });
    }, []);

    useEffect(() => {
        if (value.length < 1) return;
        fetch(`http://hyper-search.lndo.site//search/${value}`, {  // TODO: CHANGE WITH HOST
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(r => r.json()).then((data) => {
            setData(data)
        });
    }, [value]);

    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <ChakraBaseProvider theme={theme}>
                <Container maxW={'5xl'}>
                    <Stack
                        as={Box}
                        textAlign={'center'}
                        spacing={{base: 8, md: 14}}
                        py={{base: 20, md: 36}}>
                        <Header isSearchFocused={isSearchFocused} isWarpStarted={isWarpStarted} tr={tr}/>
                        <Container
                            transition={'max-width 0.2s ease-in-out'}
                            maxW={isSearchFocused || isWarpStarted ? '4xl' : '2xl'}>
                            <Flex direction={'column'}>
                                <SearchBar isWarpStarted={isWarpStarted} isSearchFocused={isSearchFocused}
                                           setIsSearchFocused={setIsSearchFocused} setValue={setReactiveValue}
                                           value={reactiveValue} tr={tr}/>
                                <Result data={data} isWarpStarted={isWarpStarted}/>
                            </Flex>
                        </Container>
                        <Fade in={!isSearchFocused && !isWarpStarted}>
                            <Text color={'gray.500'} width="75%" margin="auto">
                                Query enables fast searches across our documentations, knowledge bases, tickets, and
                                forums. Instantly access relevant information with an efficient interface, making it
                                easy to
                                find answers, solutions, and discussions in one place.
                            </Text>
                        </Fade>
                    </Stack>
                </Container>
                <Fade in={isWarpStarted}>
                    <canvas ref={canvasRef} style={{
                        visibility: isWarpStarted ? 'visible' : 'hidden',
                        opacity: isWarpStarted ? '1' : '0',
                        filter: "brightness(0.8)"
                    }} id="bg"/>
                </Fade>
            </ChakraBaseProvider>
        </>
    );
}

