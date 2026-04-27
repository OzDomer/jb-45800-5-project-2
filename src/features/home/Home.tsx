import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import "./Home.css"
import CoinGeckoService from "../../shared/services/CoinGeckoService"
import { populate } from "../../shared/store/coins-slice"
import CoinCard from "./CoinCard"
import { useOutletContext } from "react-router-dom"
import  {type SelectedCoin, addCoin, removeCoin } from "../../shared/store/user-coins-slice"
import CoinPickerModal from "../../shared/components/CoinPickerModal/CoinPickerModal"

// REFACTOR INTO THUNKS AT A LATER DATE

export default function Home() {
    const dispatch = useAppDispatch()
    const searchTerm = useOutletContext<string>()
    const coins = useAppSelector(state => state.coinsSlice.coins)
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)
    const [openCoinId, setOpenCoinId] = useState<string | null>(null)
    const [pendingCoin, setPendingCoin] = useState<SelectedCoin | null>(null)

    const didRun = useRef(false)
    useEffect(() => {
        if (didRun.current) return
        didRun.current = true
        if (coins.length === 0) {
            (async function () {
                const response = await new CoinGeckoService().getAllCoins()
                dispatch(populate(response))

            })()
        }
    }
        , [])
    function handleMoreInfoClick(coinId: string) {
        coinId === openCoinId ? setOpenCoinId(null) : setOpenCoinId(coinId)
    }
    const filtered = coins.filter(coin => {
        const term = searchTerm.toLowerCase()
        return coin.name.toLowerCase().includes(term)
            || coin.symbol.toLowerCase().includes(term)
    })
    function onLimitReached(coin: SelectedCoin) {
        setPendingCoin(coin)
    }
    function onModalClose(){
        setPendingCoin(null)
    }
    function onModalConfirm(selectedIds: string[]){
        if (!pendingCoin) return
        selectedIds.forEach(id => dispatch(removeCoin(id)))
        dispatch(addCoin(pendingCoin))
        setPendingCoin(null)
    }

    return (
        <div>
            {filtered.length > 0 &&
                filtered.map(coin => <CoinCard
                    key={coin.id}
                    coinCard={coin}
                    isOpen={openCoinId === coin.id}
                    onMoreInfoClick={() => handleMoreInfoClick(coin.id)} 
                    onLimitReached={onLimitReached}
                    />)}
            {pendingCoin &&
            <CoinPickerModal 
            onClose={onModalClose} 
            onConfirm={onModalConfirm} 
            coinsToChooseFrom={userCoins}
            pendingCoin={pendingCoin}
            />}

            {coins.length === 0 &&
                "WAIT"
            }
        </div>
    )
}