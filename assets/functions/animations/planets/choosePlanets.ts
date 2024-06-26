import randomizePlanetSize from "./randomizePlanetSize";
import randomizePlanetLocation from "./randomizePlanetLocation";
import {Planet, planetsToRender} from "../../../components/common/Planets";
import randomPosition from "./randomPosition";

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
        location: randomPosition(600)
    })

    for (let i = 0; i < planetsToRender; i++) {
        const planet = planets[Math.floor(Math.random() * planets.length)];
        if (!chosenPlanets.some(p => p.planetName === planet)) {
            const size= randomizePlanetSize();
            const location= randomizePlanetLocation(size, chosenPlanets);
            chosenPlanets.push({
                planetName: planet,
                size,
                location
            });
        } else {
            i--;
        }
    }

    return chosenPlanets;
}
