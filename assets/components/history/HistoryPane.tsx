import {Stack} from "@chakra-ui/react";
import React, {useRef} from "react";
import SearchHistoryItem from "./SearchHistoryItem";
import useScrollAnimationHandler from "../../hooks/useScrollAnimationHandler";


export const searchHistoryBoxesPerPage = 6;

export default function () {
    const element = useRef<HTMLDivElement | null>(null);

    const {visibleHistory, historyChanging} = useScrollAnimationHandler(element.current);

    return (
        <Stack
            ref={element}
            textAlign="center"
            py={{base: 16, md: 18}}
        >
            {
                visibleHistory && visibleHistory.map((historyItem, key) =>
                    <React.Fragment
                        key={historyItem.id}
                    >
                        <SearchHistoryItem
                            sizeKey={key}
                            historyChanging={historyChanging}
                            historyItem={historyItem}
                        />
                    </React.Fragment>
                )
            }
        </Stack>
    )
}
