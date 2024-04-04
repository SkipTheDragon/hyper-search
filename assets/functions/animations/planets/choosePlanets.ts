import randomizePlanetSize from "./randomizePlanetSize";
import randomizePlanetLocation from "./randomizePlanetLocation";
import {Planet, planetsToRender} from "../../../components/common/Planets";

export default function choosePlanets() {

    const planets = [
        'mercury',
        'venus',
        'earth',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
    ];

    let chosenPlanets: Planet[] = [];

    chosenPlanets.push({
        planetName: 'sun',
        size: 600,
        location: {x: window.document.body.clientWidth / 2, y: window.document.body.clientHeight / 2}
    })

    for (let i = 0; i < planetsToRender; i++) {
        const planet = planets[Math.floor(Math.random() * planets.length)];
        if (!chosenPlanets.some(p => p.planetName === planet)) {
            chosenPlanets.push({
                planetName: planet,
                size: randomizePlanetSize(),
                location: randomizePlanetLocation()
            });
        } else {
            i--;
        }
    }

    return chosenPlanets;
}
