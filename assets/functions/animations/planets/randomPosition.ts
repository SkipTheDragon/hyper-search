// Randomize planets positions.
export default function randomPosition() {
    return {
        x: Math.floor(Math.random() * window.document.body.clientWidth),
        y: Math.floor(Math.random() * window.document.body.clientHeight)
    };
}
