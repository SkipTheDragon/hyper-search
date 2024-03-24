import React, {useEffect, useRef} from "react";
import WebSocketContextProvider from "../context/WebSocketContextProvider";
import Search from "../components/Search";

export default function CallToActionWithAnnotation() {

    return (
        <WebSocketContextProvider>
            <Search/>
        </WebSocketContextProvider>
    );
}

