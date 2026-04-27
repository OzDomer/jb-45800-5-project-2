import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Save, Sparkles, ArrowRight, Bot, KeyRound, Trash2 } from "lucide-react"
import { useAppSelector } from "../../shared/store/hooks"
import "./AiRecommendation.css"
import coinGeckoService from "../../shared/services/CoinGeckoService"
import openAiService from "../../shared/services/OpenAiService"
import AiCard from "./AiCard"
import type { Recommendation } from "../../shared/models/Recommendation"

const KEY_STORAGE = "API_KEY"

export default function AiRecommendation() {
    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)

    const [apiKey, setApiKey] = useState(localStorage.getItem(KEY_STORAGE) || "")
    const [savedKey, setSavedKey] = useState(localStorage.getItem(KEY_STORAGE) || "")
    const [recommendations, setRecommendations] = useState<Record<string, Recommendation>>({})
    const [reveal, setReveal] = useState(false)

    function setApiKeyToLocalStorage(value: string) {
        localStorage.setItem(KEY_STORAGE, value)
        setSavedKey(value)
    }

    function clearApiKey() {
        localStorage.removeItem(KEY_STORAGE)
        setApiKey("")
        setSavedKey("")
    }

    async function fetchRecommendation(coinId: string) {
        setRecommendations(prev => ({ ...prev, [coinId]: { status: "loading" } }))
        try {
            const coinDataResponse = await coinGeckoService.getCoinMarketData(coinId)
            if (!coinDataResponse) throw new Error("...")
            const data = await openAiService.openAiRequest(apiKey, coinDataResponse)
            setRecommendations(prev => ({ ...prev, [coinId]: { status: "success", data } }))
        } catch (e) {
            setRecommendations(prev => ({
                ...prev,
                [coinId]: { status: "error", message: "Error in fetching AI response. Try again?" },
            }))
        }
    }

    async function getAllCoinRecommendations() {
        await Promise.all(userCoins.map(coin => fetchRecommendation(coin.coinId)))
    }

    /* derived UI state — not data state */
    const anyLoading = Object.values(recommendations).some(r => r.status === "loading")
    const consulted  = Object.values(recommendations).filter(r => r.status === "success").length
    const noKey      = !savedKey
    const dirtyKey   = apiKey !== savedKey
    const keyState: "missing" | "dirty" | "saved" =
        noKey ? "missing" : dirtyKey ? "dirty" : "saved"

    return (
        <div className="AiRecommendation">
            <header className="Oracle-hero">
                <div className="Oracle-hero-tag">
                    <Sparkles size={11} strokeWidth={2.25} />
                    <span>MODEL · gpt-5-nano</span>
                </div>
                <h1 className="page-heading striped Oracle-title">
                    <span className="slash">//&nbsp;</span>ORACLE
                </h1>
                <p className="Oracle-tagline">
                    Ask the model for a <strong>buy / don't&nbsp;buy</strong> take on
                    each coin in your watchlist. Outputs are not financial advice.
                </p>
            </header>

            {/* ---- API key panel ---- */}
            <section className="Oracle-auth" aria-label="api credentials">
                <header className="Oracle-auth-bar">
                    <span className="Oracle-auth-tag">[<span> auth </span>]</span>
                    <span className={`Oracle-auth-state is-${keyState}`}>
                        <span className="Oracle-auth-dot" aria-hidden />
                        {keyState === "missing" && "missing key"}
                        {keyState === "dirty"   && "unsaved changes"}
                        {keyState === "saved"   && "key saved · local only"}
                    </span>
                </header>
                <form
                    className="Oracle-auth-form"
                    onSubmit={e => { e.preventDefault(); setApiKeyToLocalStorage(apiKey) }}
                >
                    <span className="Oracle-auth-prefix" aria-hidden>
                        <KeyRound size={13} strokeWidth={1.75} />
                    </span>
                    <input
                        className="Oracle-auth-input"
                        type={reveal ? "text" : "password"}
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="paste your openai api key"
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                        aria-label="openai api key"
                    />
                    <button
                        type="button"
                        className="Oracle-auth-reveal"
                        onClick={() => setReveal(r => !r)}
                        aria-label={reveal ? "hide key" : "reveal key"}
                        title={reveal ? "hide" : "reveal"}
                    >
                        {reveal ? <EyeOff size={12} strokeWidth={2} /> : <Eye size={12} strokeWidth={2} />}
                    </button>
                    <button
                        type="submit"
                        className="Oracle-auth-save"
                        disabled={!dirtyKey}
                        title={dirtyKey ? "save key" : "no changes"}
                    >
                        <Save size={11} strokeWidth={2.25} />
                        <span>save</span>
                    </button>
                    {savedKey && (
                        <button
                            type="button"
                            className="Oracle-auth-clear"
                            onClick={clearApiKey}
                            title="clear saved key"
                            aria-label="clear saved api key"
                        >
                            <Trash2 size={11} strokeWidth={2.25} />
                            <span>clear</span>
                        </button>
                    )}
                </form>
            </section>

            {/* ---- bulk action bar ---- */}
            {userCoins.length > 0 && (
                <section className="Oracle-actions">
                    <div className="Oracle-actions-text">
                        <span className="caps Oracle-actions-label">
                            slate · {userCoins.length} {userCoins.length === 1 ? "coin" : "coins"}
                        </span>
                        <span className="Oracle-actions-meta">
                            {consulted} of {userCoins.length} consulted
                        </span>
                    </div>
                    <button
                        type="button"
                        className="Oracle-actions-bulk"
                        disabled={anyLoading || noKey}
                        onClick={getAllCoinRecommendations}
                        title={
                            noKey      ? "save your api key first"
                          : anyLoading ? "consultation in progress"
                          : "consult all coins"
                        }
                    >
                        <Bot size={13} strokeWidth={1.75} />
                        <span>{anyLoading ? "consulting…" : "consult all"}</span>
                    </button>
                </section>
            )}

            {/* ---- empty state ---- */}
            {userCoins.length === 0 && (
                <div className="Oracle-empty corner-frame">
                    <span className="cf-tr" /><span className="cf-bl" />
                    <span className="caps Oracle-empty-tag">!  empty slate</span>
                    <h2 className="Oracle-empty-title">no coins to consult</h2>
                    <p className="Oracle-empty-body">
                        The oracle works on your watchlist. Pick at least one
                        coin on <strong>MARKET</strong>.
                    </p>
                    <Link to="/home" className="Oracle-empty-cta">
                        <span>open market</span>
                        <ArrowRight size={12} strokeWidth={2} />
                    </Link>
                </div>
            )}

            {/* ---- card stack ---- */}
            {userCoins.length > 0 && (
                <ol className="Oracle-stack">
                    {userCoins.map((coin, i) => (
                        <li key={coin.coinId} style={{ ["--i" as string]: i }}>
                            <AiCard
                                coin={coin}
                                recommendation={recommendations[coin.coinId]}
                                onGetRecommendation={() => fetchRecommendation(coin.coinId)}
                            />
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}
