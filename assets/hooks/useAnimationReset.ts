import {useAnimationStore} from "../stores/animationStore";

export default function () {
    const animationStore = useAnimationStore();

    function resetAnimations() {
        animationStore.search.reset()
        animationStore.animation.reset()
        document.body.classList.remove('opacity')
    }

    return {
        resetAnimations,
    }
}
