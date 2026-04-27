import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import { addCoin, removeCoin, type SelectedCoin } from "../../shared/store/user-coins-slice"
import "./CoinCard.css"
import type Coin from "../../shared/models/Coin"
import MoreInfo from "./MoreInfo"

interface CoinCardProps {
    coinCard: Coin,
    isOpen: boolean
    onMoreInfoClick: () => void
    onLimitReached: (coin: SelectedCoin) => void
}

export default function CoinCard({ coinCard, isOpen, onMoreInfoClick, onLimitReached }: CoinCardProps) {
    const { id, symbol, name, image, price_change_percentage_24h } = coinCard
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)
    const isInWatchlist = userCoins.some(coin => coin.coinId === id)
    const dispatch = useAppDispatch()
    function addCoinToWatchlist() {
        if (userCoins.length >= 5){
       onLimitReached({coinId: id, coinSymbol: symbol.toUpperCase(), name, image})
        }else{
             dispatch(addCoin({ coinId: id, coinSymbol: symbol.toUpperCase(), name, image }))
        }
    }
    function removeCoinFromWatchlist(coinId: string) {
        dispatch(removeCoin(coinId))
    }
    function handleWatchlistToggle() {
        if (isInWatchlist) removeCoinFromWatchlist(id)
        else addCoinToWatchlist()
    }

    return (
        <div className="CoinCard">
            <div>
                ID: {id}
                SYMBOL: {symbol}
                NAME: {name}
                <img src={image} style={{ width: 100, height: 100 }} />
                PRICE CHANGE RARARA: {price_change_percentage_24h}
                <button onClick={handleWatchlistToggle}>{isInWatchlist ? "Remove coin from watchlist" : "Add coin to watch list"}</button>
                <button onClick={onMoreInfoClick}> {isOpen ? "close more information" : "open more information"}</button>
                {isOpen &&
                    <MoreInfo coinId={id} />}
            </div>
        </div>
    )
}