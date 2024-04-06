import React from "react";
import {Button, chakra, Heading, Icon, ListItem, Text, useColorModeValue} from "@chakra-ui/react";
import {FaArrowRight} from "react-icons/fa6";
import {SearchResultItem} from "../../types/ws/results/SearchResultItem";

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
            role="group"
        >
            <chakra.a
                target={'_blank'}
                href={link}
                transition={'all 0.3s ease-in-out'}
                _groupHover={{ marginLeft: "10px" }}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
            >
                <Heading
                    as={'h4'}
                    transition={'all 0.3s ease-in-out'}
                    size={'md'}
                    _groupHover={{ color: "brand.400" }}
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
            </chakra.a>
            <Button as={'a'} target={'_blank'} href={link}>
                <Icon as={FaArrowRight} />
            </Button>
        </ListItem>
    );
}

export default Result;
