import {create, createStore} from 'zustand'
import {subscribeWithSelector} from "zustand/middleware";

export interface SearchStoreState {
    states: {
        search: string,
    },
    actions: {
        search: (term: string) => void
    }
}

/**
 * Store for the states related to animations.
 */
export const useSearchStore = create<SearchStoreState>()(
    subscribeWithSelector(
    (set) => ({
        states: {
            search: "",
        },
        actions: {
            search: (term) => set((store) => ({
                states: {
                    ...store.states,
                    search: term,
                }
            }))
        }
    }) )
)

