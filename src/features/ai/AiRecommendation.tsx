import { useState } from "react"
import { useAppSelector } from "../../shared/store/hooks"
import "./AiRecommendation.css"
import CoinGeckoService from "../home/CoinGeckoService"
import OpenAiService from "./OpenAiService"
import AiCard from "./AiCard"



export default function AiRecommendation() {

    const coins = useAppSelector(state => state.coinsSlice.coins)
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)

    const selectedCoinsData = userCoins.map(uc => coins.find(c => c.id === uc.coinId))
    const [apiKey, setApiKey] = useState(localStorage.getItem("API_KEY") || "")
    const [recommendations, setRecommendations] = useState<{ [coinId: string]: string }>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    function setApiKeyToLocalStorage(value: string) {
        localStorage.setItem("API_KEY", value)
    }

    async function fetchRecommendation(coinId: string) {
        try {
            const coinDataResponse = await new CoinGeckoService().AiRecommendation(coinId)
            if (!coinDataResponse) {
                return
            }
            const openAiResponse = await new OpenAiService().openAiRequest(apiKey, coinDataResponse)
            if (!openAiResponse) {
                return null
            }
            return openAiResponse.data.output[1].content[0].text
        }
        catch (e) {
            console.error(e)
        }
    }
    async function getOneCoinRecommendation(coinId: string) {
        setIsLoading(true)
        try {
            const aiResponseOneRecommendation = await fetchRecommendation(coinId)
            setRecommendations(prev => ({ ...prev, [coinId]: aiResponseOneRecommendation }))
        }
        finally {
            setIsLoading(false)

        }
    }

    async function getAllCoinRecommendations() {
        setIsLoading(true)
        try {
            const results = await Promise.all(
                userCoins.map(coin => fetchRecommendation(coin.coinId)))
            const newEntries: { [coinId: string]: string } = {}
            userCoins.forEach((coin, index) => {
                newEntries[coin.coinId] = results[index]
            })
            setRecommendations(prev => ({ ...prev, ...newEntries }))
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="AiRecommendation">
            <form onSubmit={(e) => { e.preventDefault(); setApiKeyToLocalStorage(apiKey) }}>
                <input placeholder="Enter Your api key here" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                <button>Enter api key</button>
            </form>
           
            <button onClick={getAllCoinRecommendations} disabled={isLoading}>Get all coins</button>
            
            {selectedCoinsData.filter(coin => coin !== undefined).map(coin =>
                <AiCard
                    key={coin.id}
                    coin={coin}
                    recommendation={recommendations[coin.id]}
                    onGetRecommendation={() => getOneCoinRecommendation(coin.id)} />)}
        </div>
    )

}
