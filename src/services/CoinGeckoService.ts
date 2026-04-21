import axios from "axios"
import type Coins from "../models/Coins"
import type MoreInformation from "../models/MoreInformation"
import type AiRecommendation from "../models/AiRecommendation"

const URL = `https://api.coingecko.com/api/v3/`

export default class CoinGeckoService {
    async getAllCoins() : Promise<Coins[]>{
        try{
            const {data} = await axios.get<Coins[]>(URL + "coins/markets?vs_currency=usd")
            return data   
        }
        catch(e){
            console.log(e)
            return []
        }
    }
        async getMoreInfo(coinId: string) : Promise<MoreInformation | null>{
        try{
            const {data} = await axios.get<MoreInformation>(URL + `coins/${coinId}`)
            return data   
        }
        catch(e){
            console.log(e)
            return null
        }
    }
        async AiRecommendation(coinId: string) : Promise<AiRecommendation | null>{
        try{
            const {data} = await axios.get<AiRecommendation>(URL + `coins/${coinId}?market_data=true`)
            return data   
        }
        catch(e){
            console.log(e)
            return null
        }
    }
}