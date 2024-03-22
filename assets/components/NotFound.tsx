import {Badge, GridItem, Heading, Icon, Text, useColorModeValue, chakra} from "@chakra-ui/react";
import {IoRadioSharp} from "react-icons/io5";
import React from "react";
import {useAnimationStore} from "../stores/animationStore";
import {useWebsocketStore} from "../stores/websocketStore";

export default function NotFound(
    {
        currentCategory,
        setReactiveValue,
        setCurrentLocation
    }: {
        currentCategory: string | null,
        setReactiveValue: React.Dispatch<React.SetStateAction<string>>
        setCurrentLocation: React.Dispatch<React.SetStateAction<string | null>>
    }
) {
    const bgColor = useColorModeValue('secondaryGray.300', 'navy.800');
    const textColor = useColorModeValue('gray.900', 'gray.200');
    const iconColor = useColorModeValue('gray.200', 'gray.500');
    const websocketStore = useWebsocketStore();
    const suggestions = Object.keys(websocketStore.states.lastMessage?.extraData.suggestions);

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
                            <chakra.div  marginTop={'0.5rem'}>
                                {
                                    suggestions.map((suggestion, index) => (
                                        <Badge
                                            key={index}
                                            _hover={{cursor: 'pointer'}}
                                            colorScheme="gray"
                                            onClick={() => {
                                                setReactiveValue(suggestion)
                                                setCurrentLocation(null)
                                            }}
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