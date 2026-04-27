import { configureStore } from "@reduxjs/toolkit"
import coinsSlice from "./coins-slice"
import userCoinsSlice, { type SelectedCoin } from "./user-coins-slice"
import { getItemFromStorage, saveToStorage } from "../utils/storage"


const persistedUserCoins = getItemFromStorage<SelectedCoin[]>("cryptonite:userCoins", [])

const store = configureStore({
    preloadedState: {
        userCoinsSlice: { userCoins: persistedUserCoins }
    },
    reducer: {
        coinsSlice,
        userCoinsSlice
    }
})
let lastSerialized = ""
store.subscribe(() => {
    const current = JSON.stringify(store.getState().userCoinsSlice.userCoins)
    if (current === lastSerialized) return
    lastSerialized = current
    saveToStorage("cryptonite:userCoins", store.getState().userCoinsSlice.userCoins)
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch