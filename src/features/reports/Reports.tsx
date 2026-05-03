import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import { ArrowRight, TrendingUp, TrendingDown, Minus, Radio } from "lucide-react"
import { useAppSelector } from "../../shared/store/hooks"
import cryptoCompareService from "../../shared/services/CryptoCompareService"
import "./Reports.css"

type Sample = { [key: string]: string | number }

const CHART_VARS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]
const SAMPLE_INTERVAL_MS = 1_000
const WINDOW_SIZE        = 600

export default function Reports() {
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)
    const [arrayForGraph, setArrayForGraph] = useState<Sample[]>([])

    useEffect(() => {
        if (userCoins.length !== 0) {
            const intervalId = setInterval(() => {
                (async function () {
                    const response = await cryptoCompareService.getCoinPriceRt(
                        userCoins.map(coin => coin.coinSymbol)
                    )
                    if (response) {
                        const entry: Sample = { time: new Date().toLocaleTimeString() }
                        Object.keys(response).forEach(key => {
                            entry[key] = response[key].USD
                        })
                        setArrayForGraph(arr => [...arr, entry].slice(-WINDOW_SIZE))
                    }
                })()
            }, SAMPLE_INTERVAL_MS)

            return () => { clearInterval(intervalId) }
        }
    }, [userCoins])

    /* derived display data — no state, just calculations */
    const samples = arrayForGraph.length
    const noTracking = userCoins.length === 0
    const awaitingFirstSample = !noTracking && samples === 0
    const latestStamp = samples > 0 ? String(arrayForGraph[samples - 1].time) : "—"

    const seriesMeta = userCoins.map((coin, i) => {
        const colorVar = CHART_VARS[i % CHART_VARS.length]
        const symbol   = coin.coinSymbol
        const first    = samples > 0 ? Number(arrayForGraph[0][symbol]) : null
        const last     = samples > 0 ? Number(arrayForGraph[samples - 1][symbol]) : null
        const delta    = first != null && last != null && first !== 0
            ? ((last - first) / first) * 100
            : null
        return { coin, symbol, colorVar, last, delta }
    })

    return (
        <div className="Reports">
            <header className="Reports-hero">
                <div className="Reports-hero-tag">
                    <Radio size={11} strokeWidth={2.25} />
                    <span>FEED · cryptocompare</span>
                </div>
                <h1 className="page-heading striped Reports-title">
                    <span className="slash">//&nbsp;</span>SIGNAL
                </h1>
                <p className="Reports-tagline">
                    Live USD price feed for your watchlist. New sample every
                    1 second, rolling window of 10 minutes.
                </p>
            </header>

            <section className="Reports-status" aria-label="feed status">
                <StatusCell label="source"   value="cryptocompare" />
                <StatusCell label="interval" value={`${SAMPLE_INTERVAL_MS / 1000}s`} />
                <StatusCell label="window"   value={`${WINDOW_SIZE} (${WINDOW_SIZE * SAMPLE_INTERVAL_MS / 60_000}m)`} />
                <StatusCell label="samples"  value={pad3(samples)} accent />
                <StatusCell label="tracking" value={`${userCoins.length}/5`} accent />
                <StatusCell label="latest"   value={latestStamp} mono />
            </section>

            {noTracking ? (
                <NoTracking />
            ) : (
                <section className="Reports-frame">
                    <header className="Reports-frame-bar">
                        <span className="Reports-frame-tag">
                            [<span> trace · {userCoins.length} {userCoins.length === 1 ? "series" : "series"} </span>]
                        </span>
                        <span className="Reports-frame-meta">
                            <span className="pulse-dot" />
                            <span>streaming</span>
                            <span className="Reports-frame-meta-sep">·</span>
                            <span>{pad3(samples)} samples</span>
                        </span>
                    </header>

                    <div className="Reports-chart-wrap">
                        {awaitingFirstSample
                            ? <AwaitingSample />
                            : (
                                <ResponsiveContainer width="100%" height={420}>
                                    <LineChart
                                        data={arrayForGraph}
                                        margin={{ top: 16, right: 24, bottom: 8, left: 8 }}
                                    >
                                        <CartesianGrid
                                            stroke="var(--grid-line-major)"
                                            strokeDasharray="2 4"
                                            vertical
                                        />
                                        <XAxis
                                            dataKey="time"
                                            stroke="var(--border-strong)"
                                            tick={chartTickStyle}
                                            tickLine={{ stroke: "var(--border)" }}
                                            axisLine={{ stroke: "var(--border-strong)" }}
                                            minTickGap={48}
                                        />
                                        <YAxis
                                            stroke="var(--border-strong)"
                                            tick={chartTickStyle}
                                            tickLine={{ stroke: "var(--border)" }}
                                            axisLine={{ stroke: "var(--border-strong)" }}
                                            tickFormatter={formatPriceTick}
                                            domain={["auto", "auto"]}
                                            width={56}
                                        />
                                        <Tooltip
                                            content={<TerminalTooltip />}
                                            cursor={{
                                                stroke: "var(--accent)",
                                                strokeWidth: 1,
                                                strokeDasharray: "2 3",
                                            }}
                                        />
                                        {userCoins.map((coin, i) => (
                                            <Line
                                                key={coin.coinSymbol}
                                                type="monotone"
                                                dataKey={coin.coinSymbol}
                                                stroke={CHART_VARS[i % CHART_VARS.length]}
                                                strokeWidth={1.5}
                                                dot={false}
                                                activeDot={{
                                                    r: 3,
                                                    strokeWidth: 1,
                                                    stroke: "var(--bg-card)",
                                                }}
                                                isAnimationActive={false}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                    </div>

                    <footer className="Reports-legend">
                        {seriesMeta.map(({ coin, symbol, colorVar, last, delta }) => {
                            const dir = delta == null
                                ? "flat"
                                : delta > 0 ? "up"
                                : delta < 0 ? "down" : "flat"
                            const Icon = dir === "up" ? TrendingUp
                                       : dir === "down" ? TrendingDown
                                       : Minus
                            return (
                                <div className={`Reports-legend-item is-${dir}`} key={coin.coinId}>
                                    <span
                                        className="Reports-legend-swatch"
                                        style={{ background: colorVar }}
                                        aria-hidden
                                    />
                                    <span className="Reports-legend-symbol">{symbol}</span>
                                    <span className="Reports-legend-price">
                                        {last == null ? "—" : formatPrice(last)}
                                    </span>
                                    <span className={`Reports-legend-delta is-${dir}`}>
                                        <Icon size={9} strokeWidth={2.5} aria-hidden />
                                        <span>{delta == null ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}%`}</span>
                                    </span>
                                </div>
                            )
                        })}
                    </footer>
                </section>
            )}

            {!noTracking && samples > 0 && (
                <section className="Reports-trace" aria-label="trace log">
                    <header className="Reports-trace-bar">
                        <span className="Reports-trace-tag">
                            [<span> trace.log </span>]
                        </span>
                        <span className="Reports-trace-meta">
                            tail · {Math.min(samples, 6)} of {pad3(samples)}
                        </span>
                    </header>
                    <ol className="Reports-trace-list">
                        {arrayForGraph.slice(-6).reverse().map((entry, i) => (
                            <li key={`${entry.time}-${i}`} className="Reports-trace-row">
                                <span className="Reports-trace-time">[{String(entry.time)}]</span>
                                <span className="Reports-trace-pairs">
                                    {userCoins.map(coin => (
                                        <span key={coin.coinSymbol} className="Reports-trace-pair">
                                            <span className="Reports-trace-key">{coin.coinSymbol}</span>
                                            <span className="Reports-trace-eq">=</span>
                                            <span className="Reports-trace-val">
                                                {entry[coin.coinSymbol] != null
                                                    ? formatPrice(Number(entry[coin.coinSymbol]))
                                                    : "—"}
                                            </span>
                                        </span>
                                    ))}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}
        </div>
    )
}

/* =========================================================
   subcomponents
   ========================================================= */

function StatusCell({
    label, value, accent, mono,
}: { label: string; value: string; accent?: boolean; mono?: boolean }) {
    return (
        <div className={`Reports-status-cell ${accent ? "is-accent" : ""}`}>
            <span className="caps Reports-status-label">{label}</span>
            <span className={`Reports-status-value ${mono ? "is-mono" : ""}`}>{value}</span>
        </div>
    )
}

function NoTracking() {
    return (
        <div className="Reports-empty corner-frame">
            <span className="cf-tr" /><span className="cf-bl" />
            <span className="caps Reports-empty-tag">!  no series tracking</span>
            <h2 className="Reports-empty-title">slate is empty</h2>
            <p className="Reports-empty-body">
                Add up to 5 coins on <strong>MARKET</strong> to start streaming
                their price feed.
            </p>
            <Link to="/home" className="Reports-empty-cta">
                <span>open market</span>
                <ArrowRight size={12} strokeWidth={2} />
            </Link>
        </div>
    )
}

function AwaitingSample() {
    return (
        <div className="Reports-await">
            <span className="Reports-await-line" aria-hidden />
            <span className="caps Reports-await-tag">awaiting first sample</span>
            <p className="Reports-await-body">
                first reading lands in 1 second.
            </p>
        </div>
    )
}

interface TooltipItem {
    color?: string
    dataKey?: string | number
    value?: number
}
interface TerminalTooltipProps {
    active?: boolean
    payload?: TooltipItem[]
    label?: string | number
}
function TerminalTooltip({ active, payload, label }: TerminalTooltipProps) {
    if (!active || !payload || payload.length === 0) return null
    return (
        <div className="Reports-tooltip">
            <div className="Reports-tooltip-time">
                <span className="caps">at</span>
                <span>{label}</span>
            </div>
            <ul className="Reports-tooltip-list">
                {payload.map((p) => (
                    <li key={String(p.dataKey)}>
                        <span
                            className="Reports-tooltip-swatch"
                            style={{ background: String(p.color) }}
                            aria-hidden
                        />
                        <span className="Reports-tooltip-key">{String(p.dataKey)}</span>
                        <span className="Reports-tooltip-val">
                            {typeof p.value === "number" ? formatPrice(p.value) : "—"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

/* =========================================================
   helpers
   ========================================================= */

const chartTickStyle = {
    fill: "var(--text-mute)",
    fontSize: 10,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.02em",
} as const

function pad3(n: number) {
    return String(n).padStart(3, "0")
}
function formatPrice(n: number): string {
    if (!Number.isFinite(n)) return "—"
    if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    if (n >= 1)    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`
}
function formatPriceTick(n: number): string {
    if (!Number.isFinite(n)) return ""
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`
    if (n >= 1)   return `$${n.toFixed(0)}`
    return `$${n.toFixed(2)}`
}
