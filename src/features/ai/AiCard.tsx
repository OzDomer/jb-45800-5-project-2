import type { SelectedCoin } from "../../shared/store/user-coins-slice"
import "./AiCard.css"

interface AiCardProps {
    coin: SelectedCoin
    recommendation: string
    onGetRecommendation: () => void
}

export default function AiCard({ coin, recommendation, onGetRecommendation}: AiCardProps){
    const { coinId, coinSymbol, name, image } = coin


    return (
        <div className="AiCard">
        <button onClick={onGetRecommendation}>Click me to fetch</button>
        id: {coinId} 
        symbol: {coinSymbol} 
        name: {name} 
        <img src={image} />
        {recommendation &&
        <p>
            Ai recommendation:{recommendation}
        </p>
        }
        </div>
    )
}