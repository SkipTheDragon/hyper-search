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
    Grid,
} from '@chakra-ui/react';
import theme from "../theme/theme";
import React, {useEffect, useRef} from "react";
import {ChatIcon, CopyIcon, EmailIcon, LinkIcon, Search2Icon, SearchIcon} from "@chakra-ui/icons";
import renderSpaceWrapDrive2 from "../functions/renderSpaceWrapDrive2";
import {
    IoBulbSharp,
    IoCardSharp,
    IoChatbubblesSharp,
    IoDocumentTextSharp,
    IoMapSharp,
    IoNewspaperSharp, IoPulseSharp, IoRadioOutline, IoRadioSharp, IoSearchSharp,
    IoTextSharp
} from "react-icons/io5";

export default function CallToActionWithAnnotation() {

    const [isWarpStarted, setIsWarpStarted] = React.useState(false);
    const [warpObject, setWarpObject] = React.useState(null);
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    const [value, setValue] = React.useState('fasfasfasfasffsafasfasfasfasadaasd')
    const tr = {
        transitionProperty: "var(--chakra-transition-property-common)",
        transitionDuration: "var(--chakra-transition-duration-normal)"
    }
    const canvasRef = useRef(null)
    const searchBoxRef = useRef(null)
    const buttonData: {
        id: number;
        label: string;
        icon?: React.ReactElement;
            backgroundColor?: string;
    }[] = [
            { id: 1, label: 'Documentations', icon: <Icon as={IoDocumentTextSharp} />, backgroundColor: '#FF6384' },
            { id: 2, label: 'Knowledgebases', icon: <Icon as={IoBulbSharp} />, backgroundColor: '#36A2EB' },
            { id: 3, label: 'Forums', icon: <Icon as={IoChatbubblesSharp} />, backgroundColor: '#FFCE56' },
            { id: 4, label: 'Descriptions', icon: <Icon as={IoTextSharp} />, backgroundColor: '#4BC0C0' },
            { id: 5, label: 'Products', icon: <Icon as={IoCardSharp} />, backgroundColor: '#FF9F40' },
            { id: 6, label: 'Roadmaps', icon: <Icon as={IoMapSharp} />, backgroundColor: '#9966FF' },
            { id: 7, label: 'Changelogs', icon: <Icon as={IoNewspaperSharp} />, backgroundColor: '#FF6384' }
        ]

    ;
    useEffect(() => {
        document.body.style.transition = 'background-color 0.2s ease-in-out';

        if (isSearchFocused) {
            document.body.style.backgroundColor = '#01031C';
        } else {
            document.body.style.backgroundColor = "";
        }

        if (value.length >= 3 && !isWarpStarted) {
            //@ts-ignore
            setWarpObject(new renderSpaceWrapDrive2(canvasRef.current));
            setIsWarpStarted(true);
        } else if (value.length < 3 && isWarpStarted) {
            const canvas = canvasRef.current;
            if (canvas === null) return;
            // @ts-ignore
            const ctx = canvas.getContext("2d");
            ctx.reset();
            setWarpObject(null);
            setIsWarpStarted(false)
        }

        // Function to run after the DOM is rendered
        // renderSpaceWrapDriver(
        //     ((canvasRef as unknown) as { current: HTMLCanvasElement }),
        //     ((searchBoxRef as unknown) as { current: HTMLInputElement }),
        // );
    }, [value, isWarpStarted, isSearchFocused]);

    return (
        <ChakraBaseProvider theme={theme}>
            <Container maxW={'5xl'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{base: 8, md: 14}}
                    py={{base: 20, md: 36}}>
                    <Heading
                        style={tr}
                        transition={'color 0.2s ease-in-out'}
                        color={(isSearchFocused || isWarpStarted ? 'white' : 'black')}
                        fontWeight={600}
                        fontSize={{base: '2xl', sm: '4xl', md: '6xl'}}
                        lineHeight={'110%'}>
                        {
                            isWarpStarted ? <>
                                Hyper Searching<br/>
                                <Text as={'span'} color={'brand.400'}>
                                    Initiated!
                                </Text>
                            </> : <>Type something to initiate<br/>
                                <Text as={'span'} color={'brand.400'}>
                                    hyper-searching
                                </Text></>
                        }
                    </Heading>
                    <Container
                        transition={'max-width 0.2s ease-in-out'}
                        maxW={isSearchFocused || isWarpStarted ? '4xl' : '2xl'}>
                        <Flex direction={'column'}>
                            <InputGroup size="lg" className={'search-input'}>
                                <InputLeftElement pointerEvents='none'>
                                    {isWarpStarted ? <Spinner size="xs"
                                                              color={
                                                                    isSearchFocused ? 'brand.500' : 'var(--chakra-colors-chakra-border-color)'
                                                                }/>
                                        :
                                        <SearchIcon
                                            style={tr}
                                            color={
                                                isSearchFocused ? 'brand.500' : 'var(--chakra-colors-chakra-border-color)'
                                            }
                                        />}
                                </InputLeftElement>
                                <Input
                                    onBlur={() => setIsSearchFocused(false)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onChange={(e) => setValue(e.target.value)}
                                    value={value}
                                    borderBottomRadius={isWarpStarted ? '0' : 'md'}
                                    bg={isWarpStarted ? 'white' : 'gray.50'}
                                    ref={searchBoxRef}
                                    id="hyper-search"
                                    size="lg"
                                    placeholder='Type here...'/>
                            </InputGroup>
                            <Collapse in={isWarpStarted}>
                                <Box
                                    color='white'
                                    bg={
                                        isWarpStarted ? 'white' : 'var(--chakra-colors-chakra-border-color)'
                                    }
                                    borderBottomRadius={'md'}
                                    shadow='md'
                                >
                                    <Grid templateColumns='35% 65%' gap={0}>
                                        <GridItem w='100%' display="flex" flexDirection='column' borderRight={'1px'} borderColor={"gray.300"}>
                                            {buttonData.map((button) => (
                                                <Button
                                                    _hover={{ bg: 'gray.200' }}
                                                    leftIcon={
                                                    <>
                                                        <Box
                                                            color={'white'}
                                                            bg={button.backgroundColor}
                                                            w={'1.7rem'}
                                                            h={'1.7rem'}
                                                            display={"flex"}
                                                            alignItems={'center'}
                                                            justifyContent={'center'}
                                                            padding={'0.5rem'}
                                                            borderRadius={'md'}
                                                        >
                                                            {button.icon ?? <SearchIcon boxSize={3}/>}
                                                        </Box>
                                                    </>
                                                    }

                                                    justifyContent={'left'}
                                                    borderRadius={0}
                                                    paddingX={'1rem'}
                                                    paddingY={'2rem'}
                                                    key={button.id}
                                                    variant='ghost'
                                                >
                                                    <div>
                                                        {button.label}
                                                        <Text
                                                            color={"gray.500"}
                                                            style={
                                                            {
                                                                fontSize: '0.65rem',
                                                                textAlign: 'left',
                                                            }
                                                        }>0 results</Text>
                                                    </div>

                                                </Button>
                                            ))}
                                        </GridItem>
                                        <GridItem
                                            w='100%'
                                            h='100%'
                                            bg={'bg.300'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            display={'flex'}
                                        >
                                            <div>
                                                <Icon as={IoRadioSharp} boxSize={16} color={'gray.200'} style={{margin: 'auto'}}/>
                                                <Heading
                                                    mt={4}
                                                    mb={2}
                                                    style={tr}
                                                    transition={'color 0.2s ease-in-out'}
                                                    color={'gray.900'}
                                                    fontWeight={600}
                                                    fontSize={{base: 'lg', sm: 'xl', md: '2xl'}}
                                                    lineHeight={'110%'}>
                                                    Nothing here yet!
                                                </Heading>

                                                <Text color={'gray.500'} w={"85%"} margin="auto">
                                                    Check for misspellings or try a different search term.
                                                </Text>
                                            </div>
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </Collapse>
                        </Flex>
                    </Container>
                    <Fade in={!isSearchFocused && !isWarpStarted}>
                        <Text color={'gray.500'} width="75%" margin="auto">
                            Query enables fast searches across our documentations, knowledge bases, tickets, and
                            forums. Instantly access relevant information with an efficient interface, making it easy to
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
    );
}

