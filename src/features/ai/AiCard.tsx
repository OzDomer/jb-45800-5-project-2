import { useState } from "react"
import { Bot, Check, X, RefreshCw, AlertCircle, ScrollText, Sparkles } from "lucide-react"
import type { Recommendation } from "../../shared/models/Recommendation"
import type { SelectedCoin } from "../../shared/store/user-coins-slice"
import "./AiCard.css"

interface AiCardProps {
    coin: SelectedCoin
    recommendation: Recommendation | undefined
    onGetRecommendation: () => void
}

export default function AiCard({ coin, recommendation, onGetRecommendation }: AiCardProps) {
    const { coinId, coinSymbol, name, image } = coin
    const [imgFailed, setImgFailed] = useState(false)

    const status = recommendation?.status  /* "loading" | "success" | "error" | undefined */
    const verdict = recommendation?.status === "success" ? recommendation.data.verdict : null
    const verdictTone: "buy" | "no" | null =
        verdict === "buy"       ? "buy"
      : verdict === "don't buy" ? "no"
      : null

    const cardClass = [
        "AiCard",
        status && `is-${status}`,
        verdictTone && `is-verdict-${verdictTone}`,
    ].filter(Boolean).join(" ")

    return (
        <article className={cardClass}>
            {/* ---- title bar ---- */}
            <header className="AiCard-bar">
                <span className="AiCard-bar-tag">
                    [<span> dossier </span>]
                </span>
                <span className="AiCard-bar-id">
                    <span className="caps">id</span>
                    <span className="AiCard-bar-id-value">{coinId}</span>
                </span>
                <span className="AiCard-bar-state">
                    <StateBadge status={status} verdictTone={verdictTone} />
                </span>
            </header>

            {/* ---- identity ---- */}
            <section className="AiCard-id">
                <div className="AiCard-avatar" aria-hidden>
                    {!imgFailed && image
                        ? <img src={image} alt="" onError={() => setImgFailed(true)} />
                        : <span>{coinSymbol.slice(0, 2)}</span>}
                </div>
                <div className="AiCard-id-text">
                    <h3 className="AiCard-symbol">{coinSymbol}</h3>
                    <p className="AiCard-name">{name}</p>
                </div>
            </section>

            {/* ---- body — switches by status ---- */}
            {!status && (
                <Idle onConsult={onGetRecommendation} />
            )}

            {status === "loading" && (
                <Consulting />
            )}

            {recommendation?.status === "error" && (
                <ErrorPanel
                    message={recommendation.message}
                    onRetry={onGetRecommendation}
                />
            )}

            {recommendation?.status === "success" && (
                <Result
                    verdict={recommendation.data.verdict}
                    explanation={recommendation.data.explanation}
                    flavor={recommendation.data.flavor}
                    onRerun={onGetRecommendation}
                />
            )}
        </article>
    )
}

/* ============================================================
   subcomponents
   ============================================================ */

function StateBadge({
    status, verdictTone,
}: {
    status: "loading" | "success" | "error" | undefined
    verdictTone: "buy" | "no" | null
}) {
    if (status === "loading") {
        return <span className="AiCard-state is-loading">
            <span className="pulse-dot" />
            <span>consulting</span>
        </span>
    }
    if (status === "error") {
        return <span className="AiCard-state is-error">
            <span className="pulse-dot danger" />
            <span>error</span>
        </span>
    }
    if (status === "success" && verdictTone === "buy") {
        return <span className="AiCard-state is-buy">
            <Check size={10} strokeWidth={2.5} /> <span>buy</span>
        </span>
    }
    if (status === "success" && verdictTone === "no") {
        return <span className="AiCard-state is-no">
            <X size={10} strokeWidth={2.5} /> <span>don't buy</span>
        </span>
    }
    return <span className="AiCard-state is-idle">
        <span>idle</span>
    </span>
}

function Idle({ onConsult }: { onConsult: () => void }) {
    return (
        <div className="AiCard-idle">
            <p className="AiCard-idle-prompt">
                <span className="caps">prompt</span>
                <span> ↳ buy or don't buy?</span>
            </p>
            <button
                type="button"
                className="AiCard-idle-cta"
                onClick={onConsult}
            >
                <Bot size={13} strokeWidth={1.75} />
                <span>consult oracle</span>
            </button>
        </div>
    )
}

function Consulting() {
    return (
        <div className="AiCard-consulting" role="status" aria-live="polite">
            <span className="AiCard-consulting-label caps">
                consulting · gpt-5-nano
            </span>
            <span className="AiCard-consulting-bar" aria-hidden>
                <span className="AiCard-consulting-cylon" />
            </span>
            <span className="AiCard-consulting-stream">
                <span>{">"}</span>
                <span>fetching market data</span>
                <span>·</span>
                <span>posting to /v1/responses</span>
                <span>·</span>
                <span>parsing schema</span>
                <span className="AiCard-consulting-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </span>
        </div>
    )
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="AiCard-error">
            <span className="AiCard-error-icon" aria-hidden>
                <AlertCircle size={14} strokeWidth={2.25} />
            </span>
            <div className="AiCard-error-text">
                <span className="caps AiCard-error-label">stderr</span>
                <p className="AiCard-error-msg">{message}</p>
            </div>
            <button
                type="button"
                className="AiCard-error-retry"
                onClick={onRetry}
            >
                <RefreshCw size={11} strokeWidth={2.25} />
                <span>retry</span>
            </button>
        </div>
    )
}

function Result({
    verdict, explanation, flavor, onRerun,
}: {
    verdict: "buy" | "don't buy"
    explanation: string
    flavor: string
    onRerun: () => void
}) {
    const isBuy = verdict === "buy"
    return (
        <div className="AiCard-result">
            {/* ---- verdict ---- */}
            <div className={`AiCard-verdict ${isBuy ? "is-buy" : "is-no"}`}>
                <span className="caps AiCard-verdict-label">verdict</span>
                <span className="AiCard-verdict-call">
                    {isBuy
                        ? <Check size={18} strokeWidth={2.5} />
                        : <X size={18} strokeWidth={2.5} />}
                    <span>{verdict}</span>
                </span>
            </div>

            {/* ---- case ---- */}
            <section className="AiCard-section">
                <header className="AiCard-section-head">
                    <ScrollText size={11} strokeWidth={2} />
                    <span className="caps">case</span>
                    <span className="AiCard-section-rule" aria-hidden />
                </header>
                <p className="AiCard-section-body">{explanation}</p>
            </section>

            {/* ---- lore ---- */}
            <section className="AiCard-section AiCard-section--lore">
                <header className="AiCard-section-head">
                    <Sparkles size={11} strokeWidth={2} />
                    <span className="caps">lore</span>
                    <span className="AiCard-section-rule" aria-hidden />
                </header>
                <p className="AiCard-section-body">{flavor}</p>
            </section>

            {/* ---- footer ---- */}
            <footer className="AiCard-foot">
                <span className="AiCard-foot-meta caps">
                    not financial advice
                </span>
                <button
                    type="button"
                    className="AiCard-foot-rerun"
                    onClick={onRerun}
                    title="re-consult"
                >
                    <RefreshCw size={11} strokeWidth={2.25} />
                    <span>re-run</span>
                </button>
            </footer>
        </div>
    )
}
