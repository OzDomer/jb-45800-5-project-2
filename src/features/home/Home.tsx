import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import "./Home.css"
import CoinGeckoService from "./CoinGeckoService"
import { populate } from "./coins-slice"

// REFACTOR INTO THUNKS AT A LATER DATE


export default function Home() {   
        const dispatch = useAppDispatch()
        const coins = useAppSelector(state => state.coinsSlice.coins)
        const didRun = useRef(false)
    useEffect(() => {
        if (didRun.current) return
        didRun.current = true
        if (coins.length === 0) {
    // fetch and dispatch  
        (async function (){
            try{
            const  respone = await new CoinGeckoService().getAllCoins()
            dispatch(populate(respone))
            console.log(respone)
            console.log(coins.length)
        }
        catch(e){
            console.log(e)
        }
        })()
       
    }
}
        , []) 
    return(
        <div>
            AGOGOGOOGO
        </div>
    )
}