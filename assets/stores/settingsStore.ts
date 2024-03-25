import {create, createStore} from 'zustand'
import {subscribeWithSelector} from "zustand/middleware";
import {usePrefersReducedMotion} from "@chakra-ui/react";
import {createContext} from "react";
import {createWebsocketStore} from "./websocketStore";

export interface SettingsStoreState {
    states: {
        reducedMotion: boolean,
        synced: boolean,
        animationDelay: number,
    },
    actions: {
        setAnimationDelay: (animationDelay: number) => void
        setReducedMotion: (isReducedMotion: boolean) => void
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
                animationDelay: 5000
            },
            actions: {
                setAnimationDelay: (animationDelay: number) => set(store => ({
                    states: {
                        ...store.states,
                        animationDelay
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


