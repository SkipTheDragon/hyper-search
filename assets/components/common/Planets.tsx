import '../../styles/planets.css';
import {useEffect, useState} from "react";
import {AnimationState, SearchState, useAnimationStore} from "../../stores/animationStore";
import {useWebsocketStore} from "../../context/WebSocketContextProvider";
import {WebsocketStoreState} from "../../stores/websocketStore";
import choosePlanets from "../../functions/animations/planets/choosePlanets";
import animationCssState from "../../functions/animations/planets/animationCssState";

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
    const websocketStore = useWebsocketStore<WebsocketStoreState>((store) => store);

    useEffect(() => {
        setChosenPlanets(choosePlanets());
    }, [])

    // How many planets to render.

    useEffect(() => {
        if (websocketStore.states.pastResults.length > 3) {
            setTimeout(() => {
                setFirstSearch(false);
            }, 2000)
        }
    }, [websocketStore.states.pastResults]);

    return (
        <div className="vars" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: firstSearch ?  'hidden' : 'visible',
            zIndex: -1,
            animation: animationCssState(firstSearch, animationStore.states.animation),
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
