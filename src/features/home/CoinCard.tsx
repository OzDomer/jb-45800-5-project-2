import { useState } from "react"
import { TrendingUp, TrendingDown, ChevronDown, Minus } from "lucide-react"
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
    const { id, symbol, name, image, current_price, price_change_percentage_24h } = coinCard
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)
    const isInWatchlist = userCoins.some(coin => coin.coinId === id)
    const dispatch = useAppDispatch()
    const [imgFailed, setImgFailed] = useState(false)

    function addCoinToWatchlist() {
        if (userCoins.length >= 5) {
            onLimitReached({ coinId: id, coinSymbol: symbol.toUpperCase(), name, image })
        } else {
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

    const direction: "up" | "down" | "flat" =
        price_change_percentage_24h > 0 ? "up" :
        price_change_percentage_24h < 0 ? "down" : "flat"

    const cardClass = [
        "CoinCard",
        isInWatchlist && "is-active",
        isOpen        && "is-expanded",
        `is-${direction}`,
    ].filter(Boolean).join(" ")

    return (
        <article className={cardClass}>
            <header className="CoinCard-head">
                <span className="CoinCard-rank caps">#</span>
                <DeltaPill direction={direction} value={price_change_percentage_24h} />
            </header>

            <div className="CoinCard-id">
                <div className="CoinCard-avatar" aria-hidden>
                    {!imgFailed && image ? (
                        <img
                            src={image}
                            alt=""
                            onError={() => setImgFailed(true)}
                            loading="lazy"
                        />
                    ) : (
                        <span className="CoinCard-avatar-fallback">
                            {symbol.slice(0, 2).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="CoinCard-id-text">
                    <h3 className="CoinCard-symbol">{symbol.toUpperCase()}</h3>
                    <p className="CoinCard-name">{name}</p>
                </div>
            </div>

            <div className="CoinCard-price">
                <span className="caps CoinCard-price-label">px·usd</span>
                <span className="CoinCard-price-value">{formatUsd(current_price)}</span>
                <span className={`CoinCard-price-bar is-${direction}`} aria-hidden />
            </div>

            <button
                type="button"
                className="CoinCard-inspect"
                onClick={onMoreInfoClick}
                aria-expanded={isOpen}
            >
                <span>{isOpen ? "hide details" : "more info"}</span>
                <ChevronDown
                    className="CoinCard-inspect-chev"
                    size={12}
                    strokeWidth={2}
                />
            </button>

            {isOpen && (
                <div className="CoinCard-expanded">
                    <MoreInfo coinId={id} />
                </div>
            )}

            <footer className="CoinCard-foot">
                <span className="caps">track</span>
                <TerminalSwitch
                    on={isInWatchlist}
                    onClick={handleWatchlistToggle}
                    label={isInWatchlist ? "tracking" : "untracked"}
                />
            </footer>
        </article>
    )
}

/* ------------- subcomponents ------------- */

interface DeltaPillProps {
    direction: "up" | "down" | "flat"
    value: number
}
function DeltaPill({ direction, value }: DeltaPillProps) {
    const Icon = direction === "up"   ? TrendingUp
              : direction === "down" ? TrendingDown
              : Minus
    const glyph = direction === "up" ? "▲" : direction === "down" ? "▼" : "•"
    const sign = value > 0 ? "+" : ""
    return (
        <span className={`CoinCard-delta is-${direction}`}>
            <Icon size={11} strokeWidth={2.25} aria-hidden />
            <span className="CoinCard-delta-glyph" aria-hidden>{glyph}</span>
            <span className="CoinCard-delta-value">
                {sign}{value?.toFixed(2) ?? "0.00"}%
            </span>
        </span>
    )
}

interface TerminalSwitchProps {
    on: boolean
    onClick: () => void
    label: string
}
function TerminalSwitch({ on, onClick, label }: TerminalSwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            className={`TerminalSwitch ${on ? "is-on" : "is-off"}`}
            onClick={onClick}
            title={label}
        >
            <span className="TerminalSwitch-label">{on ? "on" : "off"}</span>
            <span className="TerminalSwitch-track" aria-hidden>
                <span className="TerminalSwitch-thumb" />
            </span>
        </button>
    )
}

/* ------------- format helpers ------------- */

function formatUsd(n: number | null | undefined): string {
    if (n == null || Number.isNaN(n)) return "—"
    if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    if (n >= 1)    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`
}
