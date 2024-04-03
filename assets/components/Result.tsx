import {Box, Button, Collapse, Grid, GridItem, List, Text, useColorModeValue} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {SearchIcon} from "@chakra-ui/icons";
import NotFound from "./NotFound";
import Bar from "./Bar";
import ResultItem from "./ResultItem";
import {AnimationState, SearchBoxState, useAnimationStore} from "../stores/animationStore";
import {WebsocketStoreState} from "../stores/websocketStore";
import {useWebsocketStore} from "../context/WebSocketContextProvider";
import {CategoryResult} from "../types/ws/results/CategoryResult";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import DynamicIcon from "./DynamicIcon";

const Result = () => {
    const borderColor = useColorModeValue('secondaryGray.200', 'gray.800');
    const bgColor = useColorModeValue('gray.100', 'navy.700');
    const bgColorHover = useColorModeValue('gray.200', 'navy.800');
    const [currentLocation, setCurrentLocation] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<CategoryResult['items']>([]);
    const animationStore = useAnimationStore();
    const websocketStore = useWebsocketStore<WebsocketStoreState>((store : WebsocketStoreState ) => store);

    const lastSearchQueryData = websocketStore.states.mappedResults?.SEARCH_QUERY?.data;

    useEffect(() => {
        websocketStore.actions.sendMessage({
            type: MessageTypes.FetchCategoriesQuery,
        });
    }, []);

    useEffect(() => {
        setCategories(websocketStore.states.mappedResults?.FETCH_CATEGORIES_QUERY?.items ?? [])
    }, [websocketStore.states.mappedResults]);

    useEffect(() => {
        if (animationStore.states.searchBox === SearchBoxState.Focused) {
            setCurrentLocation(null)
        }
    }, [animationStore.states.searchBox])

    if (lastSearchQueryData === undefined) {
        return null;
    }

    function changeLocation(location: string) {
        setCurrentLocation(location);
        animationStore.searchBox.blur();
        if (document?.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    return (
        <Collapse in={animationStore.states.animation === AnimationState.Finished}>
            <Box
                color='white'
                bg={bgColor}
                borderBottomRadius={'md'}
                shadow='md'
            >
                <Grid templateColumns='35% 65%' gap={0}>
                    <GridItem w='100%'
                              paddingY={'2px'}
                              display="flex"
                              flexDirection='column'
                              borderRight={'1px'}
                              borderColor={borderColor}>
                        {categories.map((category, index) => (
                            <Button
                                _hover={{bg: bgColorHover}}
                                _focusVisible={{bg: bgColorHover}}
                                boxShadow={'none'}
                                bg={currentLocation === category.name ? bgColorHover : bgColor}
                                onFocus={() => changeLocation(category.name)}
                                onMouseOver={() => changeLocation(category.name)}
                                onClick={() => changeLocation(category.name)}
                                leftIcon={
                                    <>
                                        <Box
                                            color={'white'}
                                            bg={category.bgColor}
                                            w={'1.7rem'}
                                            h={'1.7rem'}
                                            display={"flex"}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            padding={'0.5rem'}
                                            borderRadius={'md'}
                                        >
                                            {category.icon ? <DynamicIcon nameIcon={category.icon}/> : <SearchIcon boxSize={3}/>}
                                        </Box>
                                    </>
                                }

                                justifyContent={'left'}
                                borderRadius={0}
                                paddingX={'1rem'}
                                paddingY={'2rem'}
                                key={index}
                                variant='ghost'
                            >
                                <div>
                                    {category.name}
                                    <Text
                                        color={"gray.500"}
                                        style={
                                            {
                                                fontSize: '0.65rem',
                                                textAlign: 'left',
                                            }
                                        }>{lastSearchQueryData.filter(result => result._source.location === category.name).length} results</Text>
                                </div>

                            </Button>
                        ))}
                    </GridItem>

                    {
                        lastSearchQueryData.length === 0 || (currentLocation !== null &&
                            lastSearchQueryData.filter(result => result._source.location === currentLocation).length === 0) ?
                            <NotFound currentCategory={currentLocation}
                                      setCurrentLocation={setCurrentLocation}
                            />
                            :
                            <List gap={0} maxHeight={'500px'} overflowY="auto">
                                {lastSearchQueryData.map((result, index) => (
                                    <React.Fragment key={index}>
                                        {
                                            currentLocation === null ?
                                                <ResultItem {...result._source}/>
                                                :
                                                result._source.location === currentLocation ?
                                                    <ResultItem {...result._source}/>
                                                    :
                                                    null
                                        }
                                    </React.Fragment>
                                ))}
                            </List>
                    }

                    <GridItem
                        w='100%'
                        h='100%'
                        gridColumn={'1/ span 2'}
                    >
                        <Bar/>
                    </GridItem>
                </Grid>
            </Box>
        </Collapse>
    );
}

export default Result;
