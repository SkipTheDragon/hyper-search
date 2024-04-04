// Function to check if two positions are too close

export default function isTooClose(pos1: { x: number, y: number }, pos2: { x: number, y: number }) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 300;
}
