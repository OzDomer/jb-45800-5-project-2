import CoinGeckoService from "../../features/home/CoinGeckoService"
import "./Layout.css"
import Header from "./Header"
import Footer from "./Footer"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { populate } from "../../features/home/coins-slice"
import { Outlet } from "react-router-dom"


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
        <Header />
        <Outlet />
        <Footer />
        </>
    )
}