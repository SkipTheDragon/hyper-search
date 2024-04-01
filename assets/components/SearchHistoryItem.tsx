import React, {useEffect, useState} from "react";
import {Input, SlideFade, useColorModeValue} from "@chakra-ui/react";

export default function SearchHistoryItem(
    {
        historyItem,
        sizeKey,
        searches,
        historyChanging
    }
) {
    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');

    const [test, setTest] = useState(sizeKey - 1);

    useEffect(() => {
        setTimeout(() => {
            setTest(sizeKey);
        }, 100 * (searches - sizeKey));
    }, [sizeKey])

    const computeWidthBasedOnPosition = (key: number) => {
        const calc = (30 + (key * 10));
        return (calc > 100 ? 100 : calc) + '%';
    }

    const computeTranslateBasedOnPosition = (key: number, bonus: number = 0) => {
        return '-' + (((key / 1.3) * 50) + bonus) + 'px';
    }

    const input = (
        <Input
            color={searchTextColor}
            bg={searchBg}
            autoComplete="off"
            // zIndex={key}
            transition={'all 0.2s ease-in-out'}
            width={computeWidthBasedOnPosition(test)}
            transform={'translateY(' + computeTranslateBasedOnPosition(sizeKey) + ')'}
            transformOrigin={'top'}
            marginX={'auto'}
            _hover={{
                transform: 'translateY(' + computeTranslateBasedOnPosition(sizeKey, 20) + ')'
            }}
            textAlign="center"
            fontSize={"1rem"}
            size={"lg"}
            cursor={'pointer'}
            placeholder={historyItem.payload.term}
        />
    );

    return (
        <>
            <SlideFade
                key={sizeKey}
                offsetY={'50px'}
                in={historyChanging}
                transition={{exit: {delay: 0.1 * (searches - sizeKey)}, enter: {delay: 0.3 * (searches - sizeKey)}}}
            >
                {input}
            </SlideFade>
        </>
    )
}
