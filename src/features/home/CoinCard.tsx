import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import { addCoin } from "../../shared/store/user-coins-slice"
import "./CoinCard.css"
import type Coins from "./Coins"
import MoreInfo from "./MoreInfo"

interface CoinCardProps {
    coinCard: Coins,
    isOpen: boolean
    onMoreInfoClick: () => void
}

export default function CoinCard({coinCard, isOpen , onMoreInfoClick}: CoinCardProps){
    const { id, symbol, name, image, price_change_percentage_24h } = coinCard 
    const userCoins = useAppSelector(state => state.userCoinsSlice.UserCoins)
    const dispatch = useAppDispatch()
    function addCoinToWatchlist(){
        dispatch(addCoin({ coinId: id, coinSymbol: symbol }))
    }

    return(
        <div className="CoinCard">
            {isOpen &&
        <div>
            ID: {id}
            SYMBOL: {symbol}
            NAME: {name}
            <img src={image} style={{ width: 100, height: 100 }}/>
            PRICE CHANGE RARARA: {price_change_percentage_24h}
            <button onClick={addCoinToWatchlist}>Add coin to watchlist</button>
            <MoreInfo coinId={id} />
            <button onClick={onMoreInfoClick}>close more information </button>
        </div>}

        {!isOpen &&
        <div>
            ID: {id}
            SYMBOL: {symbol}
            NAME: {name}
            <img src={image} style={{ width: 100, height: 100 }}/>
            PRICE CHANGE RARARA: {price_change_percentage_24h}
            <button onClick={addCoinToWatchlist}>Add coin to watchlist</button>
            <button onClick={onMoreInfoClick}>THIS IS A VERY COOL BUTTON </button>
        </div>}
            </div>
    )
}