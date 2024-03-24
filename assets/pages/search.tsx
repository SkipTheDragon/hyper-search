import React, {useEffect, useRef} from "react";
import WebSocketContextProvider from "../context/WebSocketContextProvider";
import Search from "../components/Search";
import SettingsPanel from "../components/SettingsPanel";

export default function CallToActionWithAnnotation() {

    return (
        <WebSocketContextProvider>
            <Search/>
            <SettingsPanel/>
        </WebSocketContextProvider>
    );
}

