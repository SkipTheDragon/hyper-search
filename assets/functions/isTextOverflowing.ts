export default function (element: HTMLElement | null, maxWidth: number) : boolean {
    if (element === null) {
        return false;
    }

    return element.offsetWidth > maxWidth;
}
