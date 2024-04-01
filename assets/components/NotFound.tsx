import {Badge, GridItem, Heading, Icon, Text, useColorModeValue, chakra, Spinner} from "@chakra-ui/react";
import {IoRadioSharp} from "react-icons/io5";
import React, {startTransition, useContext, useEffect} from "react";
import {WebSocketContext, WebsocketStoreState} from "../stores/websocketStore";
import {SuggestionPayload} from "../types/ws/messages/payloads/SuggestionPayload";
import {MessageTypes} from "../types/ws/messages/MessageTypes";
import {useSearchStore} from "../stores/searchStore";
import {useWebsocketStore} from "../context/WebSocketContextProvider";

export default function NotFound(
    {
        currentCategory,
        setCurrentLocation
    }: {
        currentCategory: string | null,
        setCurrentLocation: React.Dispatch<React.SetStateAction<string | null>>
    }
) {
    const bgColor = useColorModeValue('secondaryGray.300', 'navy.800');
    const textColor = useColorModeValue('gray.900', 'gray.200');
    const iconColor = useColorModeValue('gray.200', 'gray.500');
    const iconColors = useColorModeValue('gray.700', 'navy.100');

    const searchStore = useSearchStore();
    const websocketStore = useWebsocketStore<WebsocketStoreState>((store: WebsocketStoreState) => store);

    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(
        () => {
            startTransition(() => {
                setLoading(true);
            });
            websocketStore.actions.sendMessage<SuggestionPayload>({
                type: MessageTypes.SuggestionsQuery,
                payload: {
                    term: websocketStore.states.mappedMessages.SEARCH_QUERY?.term || ''
                }
            });

        },
        [websocketStore.states.mappedResults.SEARCH_QUERY]
    );

    const rawSuggestions = websocketStore.states.mappedResults.SUGGESTION_QUERY?.suggestions;

    const suggestions = Object.keys(rawSuggestions || {});

    /**
     * Hide the loading spinner when the suggestions are loaded.
     */
    useEffect(() => {
        if (websocketStore.states.mappedResults.SUGGESTION_QUERY?.suggestions !== undefined) {
            startTransition(() => {
                setLoading(false)
            });
        }
    }, [websocketStore.states.mappedResults.SUGGESTION_QUERY?.suggestions]);

    const selectSuggestion = (suggestion :string ) => {
        searchStore.actions.search(suggestion);
        setCurrentLocation(null)
    }

    return <GridItem
        w='100%'
        h='100%'
        bg={bgColor}
        alignItems={'center'}
        justifyContent={'center'}
        display={'flex'}
    >
        <div>
            <Icon as={IoRadioSharp} boxSize={16} color={iconColor} style={{margin: 'auto'}}/>
            <Heading
                mt={4}
                mb={2}
                transition={'color 0.2s ease-in-out'}
                color={textColor}
                fontWeight={600}
                fontSize={{base: 'lg', sm: 'xl', md: '2xl'}}
                lineHeight={'110%'}>
                {currentCategory ? <>No results found in {currentCategory}.</> : <> No results found. </>}
            </Heading>

            <Text color={'gray.500'} w={"80%"} margin="auto">
                Check for misspellings, try a different search term, or change your category from the list on the left
                side. <br/>
            </Text>
            <chakra.div marginTop={'1.5rem'}>
                {
                    loading ?
                        <>
                            <Spinner
                                size="xs"
                                color={iconColors}/>
                            <Text color={'gray.500'}>
                                Loading suggestions...
                            </Text>
                        </>
                        :
                        suggestions.length === 0 ?
                            <Text color={'red.500'} margin="auto">
                                We couldn't find any suggestions for related to your query 😞.
                                Please try something else.
                            </Text>
                            :
                            <>
                                <Text color={'gray.500'} w={"80%"} margin="auto">
                                    Here are some quick suggestions for you to try out:
                                </Text>
                                <chakra.div marginTop={'0.5rem'}>
                                    {
                                        suggestions.map((suggestion, index) => (
                                            <Badge
                                                key={index}
                                                _hover={{cursor: 'pointer'}}
                                                colorScheme="gray"
                                                onClick={() => selectSuggestion(suggestion)}
                                                ml={2}
                                            >
                                                {suggestion}
                                            </Badge>
                                        ))
                                    }
                                </chakra.div>
                            </>

                }
            </chakra.div>
        </div>
    </GridItem>;
}
