import { useEffect, useState } from "react"
import "./MoreInfo.css"
import type MoreInformation from "./MoreInformation"
import CoinGeckoService from "./CoinGeckoService"


interface MoreInfoProps{
    coinId: string
}

export default function MoreInfo({coinId}: MoreInfoProps){

    const [coinInformation, setCoinInformation]= useState<MoreInformation | null>(null)

    useEffect (() => {
        
        (async function () {
            try{
        const  response = await new CoinGeckoService().getMoreInfo(coinId)
        setCoinInformation(response)
            }
            catch(e){
                console.error(e)
            }    
        }
    )()
   }, []
)



    return(
        <div className="MoreInfo">
          usd: {coinInformation?.market_data.current_price.usd}
          eur: {coinInformation?.market_data.current_price.eur}
          nis: {coinInformation?.market_data.current_price.ils}
        </div>
    )
}