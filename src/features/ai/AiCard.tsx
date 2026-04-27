import type { Recommendation } from "../../shared/models/Recommendation"
import type { SelectedCoin } from "../../shared/store/user-coins-slice"
import "./AiCard.css"

interface AiCardProps {
    coin: SelectedCoin
    recommendation: Recommendation | undefined
    onGetRecommendation: () => void
}

export default function AiCard({ coin, recommendation, onGetRecommendation }: AiCardProps) {
    const { coinId, coinSymbol, name, image } = coin


    return (
        <div className="AiCard">
            {(!recommendation) &&
                <div>
                    No fetch active press the button to activate a search
                    <button onClick={onGetRecommendation}>Click me to fetch</button>
                </div>
            }
            <div>
                coinId: {coinId}
                coinSymbol: {coinSymbol}
                name: {name}
                <img src={image} />
            </div>
            {recommendation?.status === "loading" &&
                <div>
                    Loading...
                </div>
            }
            {recommendation?.status === "success" &&
                <div>
                    {recommendation.text}
                </div>
            }

            {recommendation?.status === "error" &&
                <div>
                    {recommendation.message}
                    <button onClick={onGetRecommendation}>Retry</button>
                </div>
            }
        </div>
    )
}