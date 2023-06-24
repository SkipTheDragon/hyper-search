import {Box, Button, Collapse, Grid, GridItem, Heading, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import {
    IoBulbSharp,
    IoCardSharp,
    IoChatbubblesSharp,
    IoDocumentTextSharp, IoMapSharp, IoNewspaperSharp,
    IoRadioSharp,
    IoTextSharp
} from "react-icons/io5";
import React from "react";
import {SearchIcon} from "@chakra-ui/icons";
import NotFound from "./NotFound";
import Bar from "./Bar";

export interface ResultProps {
    isWarpStarted: boolean;
}

const Result: React.FC<ResultProps> = (
    {
        isWarpStarted,
    }) => {
    const buttonData: {
            id: number;
            label: string;
            icon?: React.ReactElement;
            backgroundColor?: string;
        }[] = [
            {id: 1, label: 'Documentations', icon: <Icon as={IoDocumentTextSharp}/>, backgroundColor: '#FF6384'},
            {id: 2, label: 'Knowledgebases', icon: <Icon as={IoBulbSharp}/>, backgroundColor: '#36A2EB'},
            {id: 3, label: 'Forums', icon: <Icon as={IoChatbubblesSharp}/>, backgroundColor: '#FFCE56'},
            {id: 4, label: 'Descriptions', icon: <Icon as={IoTextSharp}/>, backgroundColor: '#4BC0C0'},
            {id: 5, label: 'Products', icon: <Icon as={IoCardSharp}/>, backgroundColor: '#FF9F40'},
            {id: 6, label: 'Roadmaps', icon: <Icon as={IoMapSharp}/>, backgroundColor: '#9966FF'},
            {id: 7, label: 'Changelogs', icon: <Icon as={IoNewspaperSharp}/>, backgroundColor: '#FF6384'}
        ]
    ;
    const borderColor = useColorModeValue('secondaryGray.200', 'gray.800');
    const bgColor = useColorModeValue('gray.100', 'navy.700');
    const bgColorHover = useColorModeValue('gray.200', 'navy.800');


    return (
        <Collapse in={isWarpStarted}>
            <Box
                color='white'
                bg={bgColor}
                borderBottomRadius={'md'}
                shadow='md'
            >
                <Grid templateColumns='35% 65%' gap={0}>
                    <GridItem w='100%'
                              display="flex"
                              flexDirection='column'
                              borderRight={'1px'}
                              borderColor={borderColor}>
                        {buttonData.map((button) => (
                            <Button
                                _hover={{bg: bgColorHover}}
                                _focusVisible={{bg: bgColorHover}}
                                boxShadow={'none'}
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

                    <NotFound/>

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
