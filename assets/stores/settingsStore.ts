import {create, createStore} from 'zustand'
import {subscribeWithSelector} from "zustand/middleware";
import {usePrefersReducedMotion} from "@chakra-ui/react";
import {createContext} from "react";
import {createWebsocketStore} from "./websocketStore";

export interface SettingsStoreState {
    states: {
        reducedMotion: boolean,
        fillHistory: boolean,
        synced: boolean,
        animationDelay: number,
    },
    actions: {
        setAnimationDelay: (animationDelay: number) => void
        setReducedMotion: (isReducedMotion: boolean) => void
        setFillHistory: (fillHistory: boolean) => void
        setSynced: () => void
    }
}

/**
 * Store for the user's settings.
 */
export const useSettingsStore =  create<SettingsStoreState>()(
         subscribeWithSelector((set) => ({
            states: {
                synced: false, // Whether the store has been synced with the user's preferences.
                reducedMotion: false,
                fillHistory: false,
                animationDelay: 5000
            },
            actions: {
                setAnimationDelay: (animationDelay: number) => set(store => ({
                    states: {
                        ...store.states,
                        animationDelay
                    }
                })),
                setFillHistory: (fillHistory: boolean) => set(store => ({
                    states: {
                        ...store.states,
                        fillHistory
                    }
                })),
                setReducedMotion: (isReducedMotion) => set(store => ({
                    states: {
                        ...store.states,
                        reducedMotion: isReducedMotion
                    }
                })),
                setSynced: () => set(store => ({
                    states: {
                        ...store.states,
                        synced: true
                    }
                }))
            }
        }))
    )


