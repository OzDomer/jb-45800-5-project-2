import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SelectedCoin {
    coinId: string,
    coinSymbol: string
}
interface UserCoins {
    userCoins: SelectedCoin[]
}

const initialState: UserCoins = {
    userCoins: []
}
const userCoinsSlice = createSlice({
    name: "userCoins",
    initialState,
    reducers: {
        addCoin: (state, action: PayloadAction<SelectedCoin>) => {
            if (state.userCoins.some(coin => coin.coinId === action.payload.coinId)) {
                return
            }
            state.userCoins.push(action.payload)
        },
        removeCoin: (state, action: PayloadAction<string>) => {
            state.userCoins = state.userCoins.filter(coin => coin.coinId !== action.payload)
        }
    }
})
export const { addCoin, removeCoin } = userCoinsSlice.actions

export default userCoinsSlice.reducer