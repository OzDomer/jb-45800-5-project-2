import "./CoinCard.css"
import type Coins from "./Coins"

interface CoinCardProps {
    coinCard: Coins
}

export default function CoinCard(props: CoinCardProps){
    const { id, symbol, name, image, price_change_percentage_24h } = props.coinCard
    return (
        <div>
            ID: {id}
            SYMBOL: {symbol}
            NAME: {name}
            IMAGE {image}
            PRICE CHANGE RARARA: {price_change_percentage_24h}
        </div>
    )
}