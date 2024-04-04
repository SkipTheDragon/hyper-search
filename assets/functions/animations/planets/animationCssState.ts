import {AnimationState} from "../../../stores/animationStore";

export default function animationCssState(firstSearch: boolean, animation: AnimationState) {
    if (firstSearch) {
        return undefined;
    }

    // Check if this is the first time the animation is running.
    if (animation === AnimationState.Finished) {
        return 'planetsShow 1s ease-in-out forwards';
    }

    if (animation === AnimationState.Running) {
        return 'planetsHide 1s ease-in-out forwards';
    }

    return undefined;
}
