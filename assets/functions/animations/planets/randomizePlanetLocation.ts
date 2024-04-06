import randomPosition from "./randomPosition";
import isTooClose from "./isTooClose";
import {Planet} from "../../../components/common/Planets";

export default function randomizePlanetLocation(size: number, planets : Planet[]) {
    let position = randomPosition(size);
    let attempts = 0;
    while (attempts < 100) {
        let tooClose = false;
        for (let i = 0; i < planets.length; i++) {
            if (isTooClose(
                {
                    x: position.x,
                    y: position.y,
                    size: size
                },
                {
                    x: planets[i].location.x,
                    y: planets[i].location.y,
                    size: planets[i].size
                })) {
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
