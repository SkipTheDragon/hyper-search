import React, {useEffect, useRef} from "react";
import WebSocketContextProvider from "../context/WebSocketContextProvider";
import Search from "../components/Search";
import SettingsPanel from "../components/SettingsPanel";
import {ChakraBaseProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "../theme/theme";

export default function SearchPage() {
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

