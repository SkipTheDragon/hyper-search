export default function checkScrollDirectionIsUp(event: WheelEvent) {
    if (event.deltaY) {
        return event.deltaY > 0;
    }
    return event.deltaY < 0;
}
