export default function computeShadow(targetElementId: string, referenceElementId: string) {
    // Get the target element and the reference element
    const targetElement = document.getElementById(targetElementId);
    const referenceElement = document.getElementById(referenceElementId);

    if (!targetElement || !referenceElement) {
        console.error('One or both elements not found');
        return;
    }

    // Calculate the angle between the target element and the reference element
    const dx = targetElement.offsetLeft - referenceElement.offsetLeft;
    const dy = targetElement.offsetTop - referenceElement.offsetTop;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Depending on the angle, adjust the position of the black shadow
    let boxShadow;
    if (angle >= -45 && angle < 45) {
        boxShadow = 'inset 70px 0px 50px 0px black'; // right
    } else if (angle >= 45 && angle < 135) {
        boxShadow = 'inset 0px 70px 50px 0px black'; // bottom
    } else if (angle >= -135 && angle < -45) {
        boxShadow = 'inset 0px -70px 50px 0px black'; // top
    } else {
        boxShadow = 'inset -70px 0px 50px 0px black'; // left
    }

    // Apply the new box-shadow to the target element
    targetElement.style.boxShadow = `inset 10px 0px 12px -2px rgba(255, 255, 255, 0.2), ${boxShadow}, -5px 0px 10px -4px var(--earth-color)`;
}
