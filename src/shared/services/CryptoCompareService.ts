import axios from "axios";
import type CoinPriceRT from "../models/CoinPriceRT";

class CryptoCompareService {
    async getCoinPriceRt(coins: string[]): Promise<CoinPriceRT> {
       try{
        const {data} = await axios.get<CoinPriceRT>(`https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=` + coins.join(","))
        return data
       }
       catch(e){ 
        console.error(e)
        throw e
       }
    }
}
export default new CryptoCompareService()