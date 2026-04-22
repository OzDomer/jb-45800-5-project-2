import { configureStore } from "@reduxjs/toolkit"
import coinsSlice from "../../features/home/coins-slice"
import userCoinsSlice from "./user-coins-slice"

const store = configureStore({
    reducer: {
        coinsSlice,
        userCoinsSlice
}
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch