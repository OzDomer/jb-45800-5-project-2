import axios from "axios";
import type CoinPrice from "../models/CoinPrice";

class CryptoCompareService {
    async getCoinPrice(coins: string[]): Promise<CoinPrice[]> {
       try{
        const {data} = await axios.get<Record<string, { USD: number }>>(`https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=` + coins.join(","))
        return Object.entries(data).map(([coinSymbol, priceObj]) => ({
            symbol: coinSymbol,
            price: priceObj.USD
        }))
    }
       catch(e){ 
        console.error(e)
        throw e
       }
    }
}
export default new CryptoCompareService()