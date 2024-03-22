import {MutableRefObject} from "react";

export default function hotkeyPress(key : string, ref:  MutableRefObject<HTMLInputElement|null>, e: KeyboardEvent) {
    if (ref.current === null) {
        console.error('Ref is null');
        return;
    }

    if (!("focus" in ref.current)) {
        console.error('Ref Element doesn\'t have focus method');
        return;
    }

    if (e.metaKey && e.key === key) {
        e.preventDefault();
        ref.current.focus();
    }
}
