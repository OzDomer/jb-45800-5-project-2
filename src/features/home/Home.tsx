import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import "./Home.css"
import CoinGeckoService from "./CoinGeckoService"
import { populate } from "./coins-slice"
import CoinCard from "./CoinCard"
import { useOutletContext } from "react-router-dom"

// REFACTOR INTO THUNKS AT A LATER DATE

export default function Home() {
    const dispatch = useAppDispatch()
    const searchTerm = useOutletContext<string>()
    const coins = useAppSelector(state => state.coinsSlice.coins)
    const [openCoinId, setOpenCoinId] = useState<string | null>(null)
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

    return (
        <div>
            {filtered.length > 0 &&
                filtered.map(coin => <CoinCard key={coin.id} coinCard={coin} isOpen={openCoinId === coin.id} onMoreInfoClick={() => handleMoreInfoClick(coin.id)} />)}

            {coins.length === 0 &&
                "WAIT"
            }
        </div>
    )
}