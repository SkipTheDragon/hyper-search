import '../../styles/planets.css';
import {useEffect, useState} from "react";
import {useAnimationStore} from "../../stores/animationStore";
import {WebsocketStoreState} from "../../stores/websocketStore";
import choosePlanets from "../../functions/animations/planets/choosePlanets";
import animationCssState from "../../functions/animations/planets/animationCssState";
import computeShadow from "../../functions/animations/planets/computeShadow";
import {MessageTypes} from "../../types/ws/messages/MessageTypes";
import useWebsocketStore from "../../hooks/useWebsocketStore";

export interface Planet {
    planetName: string,
    size: number,
    location: { x: number, y: number }
}

export const planetsToRender = 3;

export default function () {
    const [chosenPlanets, setChosenPlanets] = useState<Planet[]>([]);
    const [firstSearch, setFirstSearch] = useState<boolean>(true);
    const animationStore = useAnimationStore();
    const websocketStore = useWebsocketStore();

    // Choose the planets to render
    useEffect(() => {
        setChosenPlanets(choosePlanets());
    }, [])

    // Compute the shadow of the planets
    useEffect(() => {
        chosenPlanets.forEach((planet) => {
            if (planet.planetName === 'sun') return;
            computeShadow(planet.planetName + '-atmosphere', 'sun-planet');
        })
    }, [chosenPlanets])

    // Handles the animation of the planets and refreshes the planets after a search.
    useEffect(() => {
        if (websocketStore.states.pastResults.length > 3) {
            const timeoutId = setTimeout(() => {
                setFirstSearch(false);
                setChosenPlanets(choosePlanets());
            }, 2000)

            return () => clearTimeout(timeoutId);
        }
    }, [websocketStore.states.pastResults]);

    return (
        <div className="vars" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: firstSearch ? 'hidden' : 'visible',
            zIndex: -1,
            animation: animationCssState(firstSearch, animationStore.states.animation),
        }}>
            {
                chosenPlanets.map((planet, index) => {
                    return (
                        <div className={"card card--" + planet.planetName}
                             key={index}
                             id={planet.planetName + '-planet'}
                             style={{
                                 transform: "translate(" + planet.location.x + "px, " + planet.location.y + "px)",
                                 width: planet.size + 'px',
                                 height: planet.size + 'px',
                             }}>
                            <div className="card__planet">
                                <div className="planet__atmosphere" id={planet.planetName + '-atmosphere'} style={{
                                    width: planet.size + 'px',
                                    height: planet.size + 'px',
                                }}>
                                    <div className="planet__surface"></div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}
