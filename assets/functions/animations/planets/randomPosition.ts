/**
 * Randomize planets positions.
 * @param size
 */
export default function randomPosition(size: number) {
    return {
        x: Math.floor(Math.random() * (window.document.body.clientWidth - size)),
        y: Math.floor(Math.random() * (window.document.body.clientHeight - size))
    };
}
