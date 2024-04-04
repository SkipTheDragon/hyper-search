import randomPosition from "./randomPosition";
import isTooClose from "./isTooClose";
import {planetsToRender} from "../../../components/common/Planets";

export default function randomizePlanetLocation() {
    let position = randomPosition();
    let attempts = 0;
    while (attempts < 100) {
        let tooClose = false;
        for (let i = 0; i < planetsToRender; i++) {
            if (isTooClose(position, randomPosition())) {
                tooClose = true;
                break;
            }
        }
        if (!tooClose) {
            return position;
        }
        attempts++;
    }
    return position;
}
