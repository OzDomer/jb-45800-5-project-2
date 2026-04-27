import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../shared/store/hooks"
import "./Home.css"
import coinGeckoService from "../../shared/services/CoinGeckoService"
import { populate } from "../../shared/store/coins-slice"
import CoinCard from "./CoinCard"
import { type SelectedCoin, addCoin, removeCoin } from "../../shared/store/user-coins-slice"
import CoinPickerModal from "../../shared/components/CoinPickerModal/CoinPickerModal"

// REFACTOR INTO THUNKS AT A LATER DATE

export default function Home() {
    const dispatch = useAppDispatch()
    const [searchTerm, setSearchTerm] = useState<string>("")
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
                const response = await coinGeckoService.getAllCoins()
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
    function onModalClose() {
        setPendingCoin(null)
    }
    function onModalConfirm(selectedIds: string[]) {
        if (!pendingCoin) return
        selectedIds.forEach(id => dispatch(removeCoin(id)))
        dispatch(addCoin(pendingCoin))
        setPendingCoin(null)
    }

    const isLoading = coins.length === 0
    const gainers   = coins.filter(c => c.price_change_percentage_24h > 0).length
    const losers    = coins.filter(c => c.price_change_percentage_24h < 0).length
    const noMatches = !isLoading && filtered.length === 0

    return (
        <div className="Home">
            <header className="Home-hero">
                <div className="Home-hero-tag">
                    <span className="pulse-dot" />
                    <span>LIVE · {new Date().toUTCString().slice(17, 25)} UTC</span>
                </div>
                <h1 className="page-heading striped Home-title">
                    <span className="slash">//&nbsp;</span>MARKET
                </h1>
                <p className="Home-tagline">
                    Live prices for the top 100 cryptocurrencies. Pick up to
                    5 coins to track them on the <strong>chart</strong> or
                    get an <strong>AI take</strong>.
                </p>
            </header>

            <section className="Home-stats" aria-label="market stats">
                <Stat label="listed"   value={pad(coins.length, 3)} />
                <Stat label="matches"  value={pad(filtered.length, 3)} />
                <Stat label="tracking" value={`${userCoins.length}/5`}  accent />
                <Stat label="gainers"  value={pad(gainers, 3)} tone="up" />
                <Stat label="losers"   value={pad(losers, 3)}  tone="down" />
            </section>

            <div className="Home-toolbar">
                <div className="Home-search">
                    <span className="Home-search-prefix" aria-hidden>
                        <Search size={14} strokeWidth={1.75} />
                    </span>
                    <input
                        className="Home-search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="search by symbol or name"
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        aria-label="search coins"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="Home-search-clear"
                            onClick={() => setSearchTerm("")}
                            aria-label="clear search"
                            title="clear (Esc)"
                        >
                            <X size={12} strokeWidth={2} />
                        </button>
                    )}
                </div>
                <div className="Home-toolbar-meta">
                    <span className="caps">found</span>
                    <span className="Home-toolbar-count">{pad(filtered.length, 3)}</span>
                    <span className="caps">/ {pad(coins.length, 3)}</span>
                </div>
            </div>

            {isLoading && <BootingScreen />}

            {noMatches && (
                <div className="Home-empty">
                    <span className="Home-empty-prefix">!&nbsp;</span>
                    no matches for <code>{searchTerm}</code>
                    <button onClick={() => setSearchTerm("")}>reset query</button>
                </div>
            )}

            {!isLoading && !noMatches && (
                <ol className="Home-grid">
                    {filtered.map(coin => (
                        <li key={coin.id}>
                            <CoinCard
                                coinCard={coin}
                                isOpen={openCoinId === coin.id}
                                onMoreInfoClick={() => handleMoreInfoClick(coin.id)}
                                onLimitReached={onLimitReached}
                            />
                        </li>
                    ))}
                </ol>
            )}

            {pendingCoin && (
                <CoinPickerModal
                    onClose={onModalClose}
                    onConfirm={onModalConfirm}
                    coinsToChooseFrom={userCoins}
                    pendingCoin={pendingCoin}
                />
            )}
        </div>
    )
}

/* ------- helpers ------- */

function pad(n: number, width = 3) {
    return String(n).padStart(width, "0")
}

interface StatProps {
    label: string
    value: string
    tone?: "up" | "down"
    accent?: boolean
}
function Stat({ label, value, tone, accent }: StatProps) {
    const cls = [
        "Home-stat",
        tone === "up"   && "is-up",
        tone === "down" && "is-down",
        accent          && "is-accent",
    ].filter(Boolean).join(" ")
    return (
        <div className={cls}>
            <span className="Home-stat-label">{label}</span>
            <span className="Home-stat-value">{value}</span>
        </div>
    )
}

function BootingScreen() {
    return (
        <div className="Home-booting" role="status" aria-live="polite">
            <pre className="Home-booting-log">
{`> establishing connection to coingecko_v3 ...    [ ok ]
> requesting GET /coins/markets?vs_currency=usd  [ ok ]
> hydrating store · 100 records                   [ .. ]
> populating watchlist memory                     [ -- ]
> awaiting signal _`}
            </pre>
            <div className="Home-booting-skel" aria-hidden>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="Home-booting-skel-card" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
            </div>
        </div>
    )
}
