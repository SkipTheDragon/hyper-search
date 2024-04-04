export default function computeWidthBasedOnPosition(key: number) {
    const calc = (30 + (key * 10));
    return (calc > 100 ? 100 : calc) + '%';
}
