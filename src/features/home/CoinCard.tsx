import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import { addCoin } from "../../shared/store/user-coins-slice"
import "./CoinCard.css"
import type Coin from "./Coin"
import MoreInfo from "./MoreInfo"

interface CoinCardProps {
    coinCard: Coin,
    isOpen: boolean
    onMoreInfoClick: () => void
}

export default function CoinCard({ coinCard, isOpen, onMoreInfoClick }: CoinCardProps) {
    const { id, symbol, name, image, price_change_percentage_24h } = coinCard
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)
    const dispatch = useAppDispatch()
    function addCoinToWatchlist() {
        dispatch(addCoin({ coinId: id, coinSymbol: symbol.toUpperCase() , name, image}))
    }

    return (
        <div className="CoinCard">
            <div>
                ID: {id}
                SYMBOL: {symbol}
                NAME: {name}
                <img src={image} style={{ width: 100, height: 100 }} />
                PRICE CHANGE RARARA: {price_change_percentage_24h}
                <button onClick={addCoinToWatchlist}>Add coin to watchlist</button>
                 <button onClick={onMoreInfoClick}> {isOpen ? "close more information" : "open more information"}</button>
                {isOpen &&
                    <MoreInfo coinId={id} />}
            </div>
        </div>
    )
}