import { useState } from "react"
import { useAppSelector } from "../../shared/store/hooks"
import "./AiRecommendation.css"
import CoinGeckoService from "../../shared/services/CoinGeckoService"
import OpenAiService from "../../shared/services/OpenAiService"
import AiCard from "./AiCard"
import type { Recommendation } from "../../shared/models/Recommendation"

export default function AiRecommendation() {

    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)

    const [apiKey, setApiKey] = useState(localStorage.getItem("API_KEY") || "")
    const [recommendations, setRecommendations] = useState<Record<string, Recommendation>>({})

    function setApiKeyToLocalStorage(value: string) {
        localStorage.setItem("API_KEY", value)
    }

    async function fetchRecommendation(coinId: string) {
        setRecommendations(prev => ({ ...prev, [coinId]: { status: "loading" } }))
        try {
            const coinDataResponse = await new CoinGeckoService().getCoinMarketData(coinId)
            if (!coinDataResponse) throw new Error("...")
            const text = await new OpenAiService().openAiRequest(apiKey, coinDataResponse)
            setRecommendations(prev => ({ ...prev, [coinId]: { status: "success", text } }))
        } catch (e) {
            setRecommendations(prev => ({ ...prev, [coinId]: { status: "error", message: "Error in fetching AI response. Try again?" } }))
        }
    }

    async function getAllCoinRecommendations() {
        await Promise.all(userCoins.map(coin => fetchRecommendation(coin.coinId)))
    }
    


    return (
        <div className="AiRecommendation">
            <form onSubmit={(e) => { e.preventDefault(); setApiKeyToLocalStorage(apiKey) }}>
                <input placeholder="Enter Your api key here" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                <button>Enter api key</button>
            </form>

            <button disabled={Object.values(recommendations).some(r => r.status === "loading")} onClick={getAllCoinRecommendations}>Get all coins</button>
            {userCoins.map(coin =>
                <AiCard
                    key={coin.coinId}
                    coin={coin}
                    recommendation={recommendations[coin.coinId]}
                    onGetRecommendation={() => fetchRecommendation(coin.coinId)} />

            )}

        </div>
    )

}
