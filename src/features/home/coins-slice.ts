import { createSlice ,type PayloadAction } from "@reduxjs/toolkit"
import type Coins from "./Coins"

interface CoinsState{
    coins: Coins[]
}

const initialState: CoinsState = {
    coins: []
}
const coinsSlice = createSlice({
    name: "coins",
    initialState,
    reducers: {
        populate: (state, action: PayloadAction<Coins[]>) => {
            state.coins = action.payload
        }
    }
})
export const { populate } = coinsSlice.actions

export default coinsSlice.reducer