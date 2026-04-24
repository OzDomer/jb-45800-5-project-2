import { createSlice ,type PayloadAction } from "@reduxjs/toolkit"

interface SelectedCoin {
    coinId: string,
    coinSymbol: string
}
interface UserCoins {
    UserCoins: SelectedCoin[]
}

const initialState: UserCoins = {
    UserCoins:[]
}
const userCoinsSlice = createSlice({
    name: "userCoins",
    initialState,
    reducers: {
        addCoin: (state, action: PayloadAction<SelectedCoin>) => {
            state.UserCoins.push(action.payload)
        },
        removeCoin: (state, action: PayloadAction<string>) => {
            state.UserCoins = state.UserCoins.filter(coin => coin.coinId !== action.payload)
        }
    }
})
export const { addCoin, removeCoin } = userCoinsSlice.actions

export default userCoinsSlice.reducer