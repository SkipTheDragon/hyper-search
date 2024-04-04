export default function computeTranslateBasedOnPosition(key: number, bonus: number = 0) {
    return '-' + (((key / 1.3) * 50) + bonus) + 'px';
}
