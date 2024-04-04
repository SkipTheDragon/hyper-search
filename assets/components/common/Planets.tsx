import '../../styles/planets.css';
import {useEffect, useState} from "react";
import {AnimationState, SearchState, useAnimationStore} from "../../stores/animationStore";
import {useWebsocketStore} from "../../context/WebSocketContextProvider";
import {WebsocketStoreState} from "../../stores/websocketStore";

interface Planet {
    planetName: string,
    size: number,
    location: { x: number, y: number }
}

export default function () {
    const [chosenPlanets, setChosenPlanets] = useState<Planet[]>([]);
    const [firstSearch, setFirstSearch] = useState<boolean>(true);
    const animationStore = useAnimationStore();
    const websocketStore = useWebsocketStore<WebsocketStoreState>((store) => store);

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

    useEffect(() => {
        setChosenPlanets(choosePlanets());
    }, [])

    // How many planets to render.
    const planetsToRender = 3;

    function choosePlanets() {
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

    // Randomize planets positions.
    function randomPosition() {
        return {
            x: Math.floor(Math.random() * window.document.body.clientWidth),
            y: Math.floor(Math.random() * window.document.body.clientHeight)
        };
    }

    // Function to check if two positions are too close
    function isTooClose(pos1: { x: number, y: number }, pos2: { x: number, y: number }) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 300;
    }

    function randomizePlanetLocation() {
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

    function randomizePlanetSize() {
        return Math.floor(Math.random() * 100) + 100;
    }

    useEffect(() => {
        if (websocketStore.states.pastResults.length > 3) {
            setTimeout(() => {
                setFirstSearch(false);
            }, 2000)
        }
    }, [websocketStore.states.pastResults]);

    const animation = () => {
        if (firstSearch) {
            return undefined;
        }

        // Check if this is the first time the animation is running.
        if (animationStore.states.animation === AnimationState.Finished) {
            return 'planetsShow 1s ease-in-out forwards';
        }

        if (animationStore.states.animation === AnimationState.Running) {
            return 'planetsHide 1s ease-in-out forwards';
        }
    }

    return (
        <div className="vars" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: firstSearch ?  'hidden' : 'visible',
            zIndex: -1,
            animation: animation(),
        }}>
            {
                chosenPlanets.map((planet, index) => {
                    return (
                        <div key={index} style={{
                        }}>
                            <div className={"card card--" + planet.planetName} style={{
                                transform: "translate(" + planet.location.x + "px, " + planet.location.y + "px)",
                                width: planet.size + 'px',
                                height: planet.size + 'px',
                            }}>
                                <div className="card__planet">
                                    <div className="planet__atmosphere" style={{
                                        width: planet.size + 'px',
                                        height: planet.size + 'px',
                                    }}>
                                        <div className="planet__surface"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}
