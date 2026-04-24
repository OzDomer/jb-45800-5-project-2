import { useEffect, useState } from "react"
import { useAppSelector } from "../../shared/store/hooks"
import CryptoCompareService from "./CryptoCompareService"
import "./Reports.css"

export default function Reports() {    
    
    const userCoins = useAppSelector(state => state.userCoinsSlice.UserCoins)
    const [arrayForGraph, setArrayForGraph] = useState<{ [key: string]: string | number }[]>([])

    
     useEffect(() => {
        if (userCoins.length !== 0) {
        setInterval(() => {
        (async function (){
                    try{
                    const  response = await new CryptoCompareService().getCoinPriceRt(userCoins.map(coin => coin.coinSymbol))
                    if (response){
                    const entry: { [key: string]: string | number } = { time: new Date().toLocaleTimeString() }
                    Object.keys(response).forEach(key => {
                    entry[key] = response[key].USD
    })
            
            setArrayForGraph(arrayForGraph => [...arrayForGraph, entry])       
            console.log(arrayForGraph)            
    }
                }
                catch(e){
                    console.log(e)
                }
                })()    
           
        }, 1* 1000)
    

        return () => {
        }
    }}, [userCoins])
            console.log(arrayForGraph)            

    
    return(
        <>
        </>
    )
}