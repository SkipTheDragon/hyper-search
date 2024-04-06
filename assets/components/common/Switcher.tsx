import {Box, FormLabel, Input, useColorModeValue} from "@chakra-ui/react";
import React from "react";

interface SwitcherProps {
    icons: { left: JSX.Element, right: JSX.Element },
    state: boolean,
    toggle: Function
}

const Switcher: React.FC<SwitcherProps> = ({state, toggle, icons}) => {
    const bgColor = useColorModeValue('secondaryGray.100', 'navy.800');
    const iconBgColor = useColorModeValue('gray.50', 'navy.700');

    return (
        <FormLabel
            htmlFor="theme-switcher"
            as={"label"}
            height="34px"
            width="68px"
            margin={"0"}
            position="relative"
        >
            <Input
                id="theme-switcher"
                type="checkbox"
                checked={state}
                onChange={() => toggle()}
                display="inline-block"
                appearance="none"
                cursor="pointer"
                height="34px"
                width="68px"
                backgroundColor={bgColor}
                borderColor={bgColor}
                borderRadius="md"
                _focusVisible={
                    {
                        outlineColor: "brand.400",
                    }
                }
            />
            <Box
                transition="all 0.2s ease-in"
                transform={`${state ? "translateX(3px)" : "translateX(34px)"}`}
                position="absolute"
                cursor="pointer"
                top={"3px"}
                left={"1px"}
                w={"28px"}
                h={"28px"}
                bg={iconBgColor}
                dropShadow={"0px 1px 2px 0px gray.50"}
                borderRadius="md"
            >
                {state ? icons.left : icons.right}
            </Box>
        </FormLabel>
    );
};

export default Switcher;
