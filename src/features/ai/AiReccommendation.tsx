import { useState } from "react"
import { useAppSelector } from "../../shared/store/hooks"
import "./AiRecommendation.css"
import CoinGeckoService from "../home/CoinGeckoService"
import OpenAiService from "./OpenAiService"



export default function AiRecommendation() {    
    
    const coins = useAppSelector(state => state.coinsSlice.coins)
    const userCoins = useAppSelector(state => state.userCoinsSlice.UserCoins)

const selectedCoinsData = userCoins.map(uc => coins.find(c => c.id === uc.coinId))
    const [apiKey, setApiKey] = useState(localStorage.getItem("API_KEY") || "")
    const [recommendations, setRecommendations] = useState<{ [coinId: string]: string }>({})
    
    function setApiKeyToLocalStorage(value: string){
        localStorage.setItem("API_KEY", value) 
    }
    
    async function fetchRecommendation(coinId: string) {
                try{
                const  coinDataResponse = await new CoinGeckoService().AiRecommendation(coinId)
                const  openAiResponse = await new OpenAiService().openAiRequest(apiKey , coinDataResponse!)
                console.log(openAiResponse!.data.output[1].content[0].text)
                return openAiResponse!.data.output[1].content[0].text
                }
                catch(e){
                    console.log(e)
                }
            } 
    async function getOneCoinRecommendation(coinId: string){
                try{
                    const aiResponseOneRecommendation = await fetchRecommendation(coinId)
                    setRecommendations(prev => ({...prev, [coinId]:aiResponseOneRecommendation}))

                }
            catch(e){
                console.log(e)
            }
            }
            async function getAllCoinRecommendations(){
                const results = await Promise.all(
                    userCoins.map(coin => fetchRecommendation(coin.coinId)))
                    const newEntries: { [coinId: string]: string } = {}
                    userCoins.forEach((coin, index) => {
                    newEntries[coin.coinId] = results[index]})
                    setRecommendations(prev => ({ ...prev,...newEntries}))
            }
    
    return(
        <div className="AiRecommendation">
            <form onSubmit={(e) => { e.preventDefault(); setApiKeyToLocalStorage(apiKey)}}>
            <input placeholder="Enter Your api key here" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}/>
            <button>Enter api key</button>
            </form>    
            <button onClick={getAllCoinRecommendations}>Get all coins recommendation</button>
        {userCoins.map(coin => 
            <div key={coin.coinId}> 
            <button onClick={() => getOneCoinRecommendation(coin.coinId)} >{coin.coinId}</button> 
            <div>{recommendations[coin.coinId]}</div> 
            </div>)}
            
        </div>
    )
}

