import type Coins from "../home/Coins"
import "./AiCard.css"

interface AiCardProps {
    coin: Coins
    recommendation: string
    onGetRecommendation: () => void
}

export default function AiCard({ coin, recommendation, onGetRecommendation}: AiCardProps){
    const { id, symbol, name, image, price_change_percentage_24h } = coin


    return (
        <div className="AiCard">
        <button onClick={onGetRecommendation}>Click me to fetch</button>
        id:: {id}
        symbol: {symbol}
        name: {name}
        <img src={image} />
        price_change_percentage_24h: {price_change_percentage_24h}
        {recommendation &&
        <p>
            Ai recommendation:{recommendation}
        </p>
        }
        </div>
    )
}