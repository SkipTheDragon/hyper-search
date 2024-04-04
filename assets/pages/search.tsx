import React, {useEffect, useRef} from "react";
import WebSocketContextProvider from "../context/WebSocketContextProvider";
import Search from "../components/search/Search";
import SettingsPanel from "../components/settings/SettingsPanel";
import {ChakraBaseProvider, ColorModeScript, usePrefersReducedMotion} from "@chakra-ui/react";
import theme from "../theme/theme";
import {useSettingsStore} from "../stores/settingsStore";

export default function SearchPage() {
    const setReducedMotion = useSettingsStore((s) => s.actions.setReducedMotion);
    const reducedMotion = usePrefersReducedMotion()

    useEffect(() => {
        setReducedMotion(reducedMotion)
    }, [reducedMotion]);

    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <ChakraBaseProvider theme={theme}>
                <WebSocketContextProvider>
                    <Search/>
                    <SettingsPanel/>
                </WebSocketContextProvider>
            </ChakraBaseProvider>
        </>);
}

