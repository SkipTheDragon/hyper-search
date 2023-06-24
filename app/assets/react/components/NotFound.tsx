import {GridItem, Heading, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import {IoRadioSharp} from "react-icons/io5";
import React from "react";

export default function NotFound(props: any) {
    const bgColor = useColorModeValue('secondaryGray.300', 'navy.800');
    const textColor = useColorModeValue('gray.900', 'gray.200');
    const iconColor = useColorModeValue('gray.200', 'gray.500');

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
                    Nothing here yet!
                </Heading>

                <Text color={'gray.500'} w={"85%"} margin="auto">
                    Check for misspellings or try a different search term.
                </Text>
            </div>
        </GridItem>;
}
