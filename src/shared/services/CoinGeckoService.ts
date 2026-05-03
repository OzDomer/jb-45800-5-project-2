import axios from "axios"
import type Coin from "../models/Coin"
import type MoreInformation from "../models/MoreInformation"
import type CoinMarketData from "../models/CoinMarketData"

const URL = `https://api.coingecko.com/api/v3/`

class CoinGeckoService {
    async getAllCoins(): Promise<Coin[]> {
        try {
            const { data } = await axios.get<Coin[]>(URL + "coins/markets?vs_currency=usd")
            return data
        }
        catch (e) {
            console.error(e)
            throw e
        }
    }
    async getMoreInfo(coinId: string): Promise<MoreInformation> {
        try {
            const { data } = await axios.get<MoreInformation>(URL + `coins/${coinId}`)
            return data
        }
        catch (e) {
            console.error(e)
            throw e
        }
    }
    async getCoinMarketData(coinId: string): Promise<CoinMarketData | null> {
        try {
            const { data } = await axios.get<CoinMarketData>(URL + `coins/${coinId}?market_data=true`)
            return data
        }
        catch (e) {
            console.error(e)
            throw e
        }
    }
}
export default new CoinGeckoService()