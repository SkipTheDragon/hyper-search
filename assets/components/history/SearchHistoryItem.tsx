import React, {useEffect, useState} from "react";
import {Input, SlideFade, useColorModeValue} from "@chakra-ui/react";
import {Message} from "../../types/ws/messages/Message";
import {SearchPayload} from "../../types/ws/messages/payloads/SearchPayload";
import {searchHistoryBoxesPerPage} from "./HistoryPane";
import {useSettingsStore} from "../../stores/settingsStore";
import computeTranslateBasedOnPosition from "../../functions/history/computeTranslateBasedOnPosition";
import computeWidthBasedOnPosition from "../../functions/history/computeWidthBasedOnPosition";

export default function SearchHistoryItem(
    {
        historyItem,
        sizeKey,
        historyChanging
    } : {
        historyItem: Message<SearchPayload>,
        sizeKey: number,
        historyChanging: boolean
    }
) {
    const searchBg = useColorModeValue('gray.50', 'navy.700');
    const searchTextColor = useColorModeValue('gray.700', 'white');
    const reducedMotion = useSettingsStore((s) => s.states.reducedMotion );
    const [width, setWidth] = useState(sizeKey - 1);

    useEffect(() => {
        setTimeout(() => {
            setWidth(sizeKey);
        }, 100 * (searchHistoryBoxesPerPage - sizeKey));
    }, [sizeKey])

    const input = (
        <Input
            color={searchTextColor}
            bg={searchBg}
            autoComplete="off"
            transition={'all 0.2s ease-in-out'}
            width={computeWidthBasedOnPosition(width)}
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
            placeholder={historyItem.payload?.term}
        />
    );

    if (reducedMotion) {
        return (
            <React.Fragment key={sizeKey}>
                {input}
            </React.Fragment>
        )
    }

    return (
        <>
            <SlideFade
                key={sizeKey}
                offsetY={'50px'}
                in={historyChanging}
                transition={{exit: {delay: 0.1 * (searchHistoryBoxesPerPage - sizeKey)}, enter: {delay: 0.3 * (searchHistoryBoxesPerPage - sizeKey)}}}
            >
                {input}
            </SlideFade>
        </>
    )
}
