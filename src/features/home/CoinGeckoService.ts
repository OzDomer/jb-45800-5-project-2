import axios from "axios"
import type Coin from "./Coin"
import type MoreInformation from "./MoreInformation"
import type AiRecommendation from "../ai/AiRecommendation.ts"

const URL = `https://api.coingecko.com/api/v3/`

export default class CoinGeckoService {
    async getAllCoins() : Promise<Coin[]>{
        try{
            const {data} = await axios.get<Coin[]>(URL + "coins/markets?vs_currency=usd")
            return data   
        }
        catch(e){
            console.error(e)
            return []
        }
    }
        async getMoreInfo(coinId: string) : Promise<MoreInformation | null>{
        try{
            const {data} = await axios.get<MoreInformation>(URL + `coins/${coinId}`)
            return data   
        }
        catch(e){
            console.error(e)
            return null
        }
    }
        async AiRecommendation(coinId: string) : Promise<AiRecommendation | null>{
        try{
            const {data} = await axios.get<AiRecommendation>(URL + `coins/${coinId}?market_data=true`)
            return data   
        }
        catch(e){
            console.error(e)
            return null
        }
    }
}