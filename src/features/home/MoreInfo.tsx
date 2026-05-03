import { useEffect, useState } from "react"
import { Loader2, Check, AlertTriangle } from "lucide-react"
import "./MoreInfo.css"
import type MoreInformation from "../../shared/models/MoreInformation"
import coinGeckoService from "../../shared/services/CoinGeckoService"

interface MoreInfoProps {
    coinId: string
}

const ROWS = [
    { code: "USD", symbol: "$", path: "usd" as const },
    { code: "EUR", symbol: "€", path: "eur" as const },
    { code: "ILS", symbol: "₪", path: "ils" as const },
]

export default function MoreInfo({ coinId }: MoreInfoProps) {
    const [coinInformation, setCoinInformation] = useState<MoreInformation | null>(null)
    const [hasError, setHasError] = useState<boolean>(false)

    useEffect(() => {
        let cancelled = false;
        (async function () {
            try {
                const response = await coinGeckoService.getMoreInfo(coinId)
                if (!cancelled) setCoinInformation(response)
            }
            catch {
                setHasError(true)
            }
        })()
        return () => { cancelled = true }
    }, [coinId])

    const isLoading = !coinInformation
    const stamp = new Date().toUTCString().slice(17, 25)

    return (
        <section className="MoreInfo" aria-live="polite">
            <span className="MoreInfo-scanline" aria-hidden />
            {!hasError && <>
                <header className="MoreInfo-head">
                    <span className={`MoreInfo-state ${isLoading ? "is-loading" : "is-done"}`}>
                        {isLoading
                            ? <Loader2 size={11} strokeWidth={2.25} className="MoreInfo-spin" />
                            : <Check size={11} strokeWidth={2.5} />}
                        <span>{isLoading ? "decoding" : "decoded"}</span>
                    </span>
                    <span className="MoreInfo-meta">
                        <span className="caps">fx · 3 pairs</span>
                        <span className="MoreInfo-meta-dot" aria-hidden>·</span>
                        <span className="caps">{stamp}<span className="MoreInfo-z">Z</span></span>
                    </span>
                </header>

                <ul className="MoreInfo-rows">
                    {ROWS.map((r, i) => {
                        const value = coinInformation?.market_data.current_price[r.path]
                        return (
                            <li
                                key={r.code}
                                className="MoreInfo-row"
                                style={{ ["--i" as string]: i }}
                            >
                                <span className="MoreInfo-row-pair" aria-label={`${r.code} per coin`}>
                                    <span className="MoreInfo-row-code">{r.code}</span>
                                    <span className="MoreInfo-row-slash" aria-hidden>/</span>
                                    <span className="MoreInfo-row-sym" aria-hidden>{r.symbol}</span>
                                </span>
                                <span className="MoreInfo-row-bar" aria-hidden />
                                <span className="MoreInfo-row-value">
                                    {value == null
                                        ? <SkelDigits />
                                        : <DecodedValue value={value} />}
                                </span>
                            </li>
                        )
                    })}
                </ul> </>}
            {hasError && (
                <div className="MoreInfo-error" role="alert">
                    <header className="MoreInfo-error-head">
                        <AlertTriangle size={11} strokeWidth={2.25} />
                        <span className="caps">decode failed</span>
                    </header>
                    <ul className="MoreInfo-error-list">
                        <li>
                            <span className="MoreInfo-error-bullet">{">"}</span>
                            <span>could not fetch this coin's data</span>
                        </li>
                    </ul>
                </div>
            )}

            <footer className="MoreInfo-foot caps">
                <span className="MoreInfo-foot-dim">src</span>
                <span className="MoreInfo-foot-path">coingecko/{coinId}</span>
                <span className="MoreInfo-foot-spacer" />
                <span className="MoreInfo-foot-dim">↻ on toggle</span>
            </footer>
        </section>
    )
}

/* ------------- subcomponents ------------- */

/* Animated digit-decode: shows random glyphs that snap to the real value.
   Uses requestAnimationFrame for ~380ms then settles. */
function DecodedValue({ value }: { value: number }) {
    const target = formatNumber(value)
    const [display, setDisplay] = useState<string>(() =>
        scramble(target.length)
    )

    useEffect(() => {
        const start = performance.now()
        const dur = 380
        let raf = 0
        const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur)
            // settle digits left-to-right
            const settled = Math.floor(p * target.length)
            setDisplay(
                target.slice(0, settled) +
                scramble(target.length - settled)
            )
            if (p < 1) raf = requestAnimationFrame(tick)
            else setDisplay(target)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [target])

    return <span className="MoreInfo-decoded-num">{display}</span>
}

function SkelDigits() {
    return (
        <span className="MoreInfo-skel">
            <span /><span /><span /><span /><span /><span />
        </span>
    )
}

/* ------------- helpers ------------- */

const GLYPHS = "0123456789#%@▒░▓▚▞✦"
function scramble(len: number): string {
    let s = ""
    for (let i = 0; i < len; i++) {
        s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    return s
}

function formatNumber(n: number): string {
    if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
    if (n >= 1) return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}
