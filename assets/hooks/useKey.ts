import {MutableRefObject, useEffect} from "react";
import hotkeyPress from "../functions/hotkeyPress";

export default function useKey(key: string, ref: MutableRefObject<HTMLInputElement | null>) {
    const listener = (e: KeyboardEvent) => hotkeyPress(key, ref, e);
    useEffect(() => {
        document.addEventListener('keydown', listener);
        return () => document.removeEventListener('keydown', listener);
    }, [key]);
}
