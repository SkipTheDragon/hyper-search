import {Box, Flex, GridItem, Kbd, Text, Tooltip, useColorMode, useColorModeValue} from "@chakra-ui/react";
import React from "react";
import Switcher from "./Switcher";
import {CheckIcon, MoonIcon, SpinnerIcon, SunIcon} from "@chakra-ui/icons";
import {usePrefersReducedMotion} from '@chakra-ui/react'

export default function Bar(props: any) {
    const {colorMode, toggleColorMode} = useColorMode();
    const bgColor = useColorModeValue('brandScheme.50', 'navy.700');
    const borderColor = useColorModeValue('secondaryGray.200', 'gray.800');
    const iconColor = useColorModeValue('brandScheme.50', 'gray.200');

    return (
        <Box
            color={'gray.500'}
            height={'50px'}
            display={'flex'}
            alignItems={'center'}
            borderTop={'1px'}
            bg={bgColor}
            borderColor={borderColor}
            borderBottomRadius={'md'}
            padding={'1rem'}
            justifyContent={'space-between'}
        >
            <Flex
                alignItems={'center'}
            >
                <Kbd mr={2}>TAB</Kbd> <span>to navigate</span>
                <Kbd ml={4} mr={2}>SHIFT</Kbd> + <Kbd mr={2}>TAB</Kbd> <span>to navigate backwards</span>
                <Kbd ml={4} mr={2}>ENTER</Kbd> <span>to select</span>
            </Flex>

            <Flex
                height={'50px'}
                alignItems={'center'}
            >
                <Switcher
                    icons={{
                        left: (<MoonIcon
                            padding="7px"
                            w={"28px"}
                            color={iconColor}
                            h={"28px"}
                        />),
                        right: (<SunIcon
                                color={iconColor}
                                padding="7px"
                                w={"28px"}
                                h={"28px"}/>
                        )
                    }}
                    state={colorMode === "dark"}
                    toggle={toggleColorMode}
                />
            </Flex>
        </Box>
    );
}
