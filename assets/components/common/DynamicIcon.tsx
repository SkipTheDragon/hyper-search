// @ts-nocheck
import React from "react";
import ioIcons from "react-icons/io5/index";

function DynamicIcon({nameIcon}: {     nameIcon: string; }) {

    if (ioIcons[nameIcon] ===  undefined) {
        console.error("Icon not found: " + nameIcon);
        return null;
    }

    return (<>{ioIcons[nameIcon]()}</>);
}

export default DynamicIcon;
