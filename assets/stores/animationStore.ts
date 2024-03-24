import {create} from 'zustand'
import {subscribeWithSelector} from "zustand/middleware";

export enum AnimationState {
    NotRunning,
    Running,
    Finished,
}

export enum SearchState {
    Waiting,
    Searching,
    Finished,
}

export enum SearchBoxState {
    Blurred,
    Focused,
}

export interface AnimationStoreState {
    states: {
        search: SearchState,
        animation: AnimationState,
        searchBox: SearchBoxState
    },
    search: {
        start: () => void
        finish: () => void
        reset: () => void
    }
    animation: {
        start: () => void
        finish: () => void
        reset: () => void
    }
    searchBox: {
        focus: () => void
        blur: () => void
    }
}

/**
 * Store for the states related to animations.
 */
export const useAnimationStore = create<AnimationStoreState>()(
    subscribeWithSelector(
    (set) => ({
        states: {
            search: SearchState.Waiting,
            animation: AnimationState.NotRunning,
            searchBox: SearchBoxState.Blurred,
        },
        search: {
            start: () => set((store) => ({
                states: {
                    ...store.states,
                    search: SearchState.Searching,
                }
            })),
            finish: () => set((store) => ({
                states: {
                    ...store.states,
                    search: SearchState.Finished,
                }
            })),
            reset: () => set((store) => ({
                states: {
                    ...store.states,
                    search: SearchState.Waiting,
                }
            })),
        },
        animation: {
            start: () => set((store) => ({
                states: {
                    ...store.states,
                    animation: AnimationState.Running,
                }
            })),
            finish: () => set((store) => ({
                states: {
                    ...store.states,
                    animation: AnimationState.Finished,
                }
            })),
            reset: () => set((store) => ({
                states: {
                    ...store.states,
                    animation: AnimationState.NotRunning,
                }
            })),
        },
        searchBox: {
            focus: () => set((store) => ({
                states: {
                    ...store.states,
                    searchBox: SearchBoxState.Focused,
                }
            })),
            blur: () => set((store) => ({
                states: {
                    ...store.states,
                    searchBox: SearchBoxState.Blurred,
                }
            })),
        }
    }) )
)

