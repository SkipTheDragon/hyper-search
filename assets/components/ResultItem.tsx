import React from "react";
import {Button, GridItem, Heading, Icon, ListItem, Text, useColorModeValue} from "@chakra-ui/react";
import {FaArrowRight} from "react-icons/fa6";
import {chakra} from "@chakra-ui/react";
import {SearchResultItem} from "../types/ws/results/SearchResultItem";

const Result: React.FC<SearchResultItem['_source']> = (
    {
        description,
        title,
        location,
        link
    }) => {
    const borderColor = useColorModeValue('secondaryGray.200', 'gray.800');
    const heading = useColorModeValue('gray.800','secondaryGray.200' );

    return (
        <ListItem
            w='100%'
            padding={'1rem'}
            borderBottom={'1px'}
            borderColor={borderColor}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
        >
            <chakra.div
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
            >
                <Heading
                    as={'h4'}
                    size={'md'}
                    color={heading}
                    marginBottom={'0.5rem'}
                >
                    {title}
                </Heading>
                <Text
                    color={'gray.500'}
                >
                    {description}
                </Text>
                <Text color={'gray.500'}>
                    In: <b>{location}</b>
                </Text>
            </chakra.div>
            <Button as={'a'} target={'_blank'} href={link}>
                <Icon as={FaArrowRight} />
            </Button>
        </ListItem>
    );
}

export default Result;
