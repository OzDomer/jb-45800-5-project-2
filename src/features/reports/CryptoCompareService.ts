import axios from "axios";
import type CoinPriceRT from "./CoinPriceRT";

export default class CryptoCompareService {
    async getCoinPriceRt(coins: string[]): Promise<CoinPriceRT | null> {
       try{
        const {data} = await axios.get<CoinPriceRT>(`https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=` + coins.join(","))
        return data
       }
       catch(e){ 
        console.error(e)
        return null
       }
    }
}