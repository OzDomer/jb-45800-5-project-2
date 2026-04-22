import CoinGeckoService from "../../../services/CoinGeckoService"
import "./Layout.css"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { populate } from "../../../store/coins-slice"


export default function Layout() {
    const dispatch = useAppDispatch()
    const coins = useAppSelector(state => state.coinsSlice.coins)
    async function getCoins(){
        const  respone = await new CoinGeckoService().getAllCoins()
        dispatch(populate(respone))
        console.log(respone)
        console.log(coins.length)
    }
    return (
        <>
    <button onClick={getCoins}>Press here</button>
        </>
    )
}