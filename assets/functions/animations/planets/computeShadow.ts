export default function computeShadow(targetElementId: string, referenceElementId: string, currentPlanetName: string) {
    // Get the target element and the reference element
    const targetElement = document.getElementById(targetElementId);
    const referenceElement = document.getElementById(referenceElementId);

    if (!targetElement || !referenceElement) {
        console.error('One or both elements not found');
        return;
    }

    // Calculate the angle between the target element and the reference element
    const targetRect = targetElement.getBoundingClientRect();
    const referenceRect = referenceElement.getBoundingClientRect();
    const dx = targetRect.left - referenceRect.left;
    const dy = targetRect.top - referenceRect.top;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Depending on the angle, adjust the position of the black shadow
    let boxShadow;

    // Works almost everytime, not perfect but good enough.
    if (angle >= -45 && angle < 45) {
        boxShadow = 'inset -'+angle+'px 0px 50px 0px black'; // left
    } else if (angle >= 45 && angle < 135) {
        boxShadow = 'inset -0 -'+angle+'px 50px 0px black'; // top
    } else if (angle >= -135 && angle < -45) {
        boxShadow = 'inset -17px '+angle+'px 43px 0px black'; // bottom
    } else {
        boxShadow = 'inset '+angle+'px 0px 50px 0px black'; // right
    }

    // Apply the new box-shadow to the target element
    targetElement.style.boxShadow = `inset 10px 0px 12px -2px rgba(255, 255, 255, 0.2), ${boxShadow}, -5px 0px 10px -4px var(--${currentPlanetName}-color)`;
}
