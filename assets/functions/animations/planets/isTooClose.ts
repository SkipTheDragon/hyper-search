
/**
 * Check if two planets are too close to each other
 * @param pos1
 * @param pos2
 */
export default function isTooClose(pos1: { x: number, y: number, size: number }, pos2: { x: number, y: number, size: number }) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (300 + pos1.size + pos2.size);
}
