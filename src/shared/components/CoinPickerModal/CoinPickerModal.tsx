import { useState } from "react"
import { AlertTriangle, X, Plus, Minus, Check } from "lucide-react"
import type { SelectedCoin } from "../../store/user-coins-slice"
import Modal from "../Modal/Modal"
import "./CoinPickerModal.css"

interface CoinPickerModalProps {
    onClose: () => void
    onConfirm: (selectedIds: string[]) => void
    coinsToChooseFrom: SelectedCoin[]
    pendingCoin: SelectedCoin
}

export default function CoinPickerModal({
    onClose,
    onConfirm,
    coinsToChooseFrom,
    pendingCoin,
}: CoinPickerModalProps) {
    const [selected, setSelected] = useState<string[]>([])

    function toggle(coinId: string) {
        selected.includes(coinId)
            ? setSelected(selected.filter(id => id !== coinId))
            : setSelected([...selected, coinId])
    }
    function handleConfirm() {
        onConfirm(selected)
        setSelected([])
    }
    function handleCancel() {
        onClose()
        setSelected([])
    }

    const evictCount = selected.length

    return (
        <Modal isOpen={true} onClose={handleCancel}>
            <div className="CoinPicker">
                {/* ----- title bar ----- */}
                <header className="CoinPicker-titlebar">
                    <span className="CoinPicker-titlebar-tag">
                        <span className="bracket">DIALOG.SYS</span>
                    </span>
                    <span className="CoinPicker-titlebar-meta">
                        watchlist · overflow
                    </span>
                    <button
                        type="button"
                        className="CoinPicker-titlebar-close"
                        onClick={handleCancel}
                        aria-label="close dialog"
                        title="close"
                    >
                        <X size={11} strokeWidth={2.25} />
                    </button>
                </header>

                {/* ----- warning header ----- */}
                <div className="CoinPicker-warn">
                    <span className="CoinPicker-warn-icon" aria-hidden>
                        <AlertTriangle size={16} strokeWidth={2.25} />
                    </span>
                    <div className="CoinPicker-warn-text">
                        <h3 className="CoinPicker-warn-title">
                            watchlist full · 5 / 5 slots
                        </h3>
                        <p className="CoinPicker-warn-body">
                            evict one or more coins to make room for{" "}
                            <strong>{pendingCoin.name}</strong>.
                        </p>
                    </div>
                </div>

                {/* ----- "to add" callout ----- */}
                <div className="CoinPicker-section CoinPicker-add">
                    <div className="CoinPicker-section-head">
                        <span className="caps CoinPicker-section-label">
                            queued to add
                        </span>
                        <span className="CoinPicker-section-rule" aria-hidden />
                    </div>
                    <CoinRow
                        coin={pendingCoin}
                        adornment={
                            <span className="CoinPicker-add-pill">
                                <Plus size={11} strokeWidth={2.25} />
                                <span>+1</span>
                            </span>
                        }
                        muted={false}
                    />
                </div>

                {/* ----- current slate (selectable) ----- */}
                <div className="CoinPicker-section CoinPicker-evict">
                    <div className="CoinPicker-section-head">
                        <span className="caps CoinPicker-section-label">
                            current slate · select to evict
                        </span>
                        <span className="CoinPicker-section-rule" aria-hidden />
                        <span className="CoinPicker-section-count">
                            {evictCount} / {coinsToChooseFrom.length}
                        </span>
                    </div>
                    <ul className="CoinPicker-list">
                        {coinsToChooseFrom.map(coin => {
                            const isSelected = selected.includes(coin.coinId)
                            return (
                                <li key={coin.coinId}>
                                    <label
                                        className={`CoinPicker-row CoinPicker-row--evict ${isSelected ? "is-selected" : ""}`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="CoinPicker-row-checkbox"
                                            checked={isSelected}
                                            onChange={() => toggle(coin.coinId)}
                                        />
                                        <span className="CoinPicker-row-checkmark" aria-hidden>
                                            <Check size={10} strokeWidth={3} />
                                        </span>
                                        <CoinRowBody coin={coin} muted={!isSelected} />
                                        <span className="CoinPicker-evict-pill">
                                            {isSelected ? (
                                                <>
                                                    <Minus size={11} strokeWidth={2.5} />
                                                    <span>evict</span>
                                                </>
                                            ) : (
                                                <span className="CoinPicker-evict-pill-keep">
                                                    keep
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* ----- footer actions ----- */}
                <footer className="CoinPicker-foot">
                    <button
                        type="button"
                        className="CoinPicker-foot-cancel"
                        onClick={handleCancel}
                    >
                        cancel
                    </button>
                    <button
                        type="button"
                        className="CoinPicker-foot-confirm"
                        onClick={handleConfirm}
                        disabled={evictCount === 0}
                    >
                        <span>commit</span>
                        <span className="CoinPicker-foot-confirm-count">
                            evict {evictCount}
                        </span>
                    </button>
                </footer>
            </div>
        </Modal>
    )
}

/* ----------- subcomponents ----------- */

interface CoinRowProps {
    coin: SelectedCoin
    adornment?: React.ReactNode
    muted?: boolean
}
function CoinRow({ coin, adornment, muted }: CoinRowProps) {
    return (
        <div className={`CoinPicker-row ${muted ? "is-muted" : ""}`}>
            <CoinRowBody coin={coin} muted={muted} />
            {adornment && <span className="CoinPicker-row-adorn">{adornment}</span>}
        </div>
    )
}

function CoinRowBody({ coin, muted }: { coin: SelectedCoin; muted?: boolean }) {
    const [imgFailed, setImgFailed] = useState(false)
    return (
        <span className={`CoinPicker-row-body ${muted ? "is-muted" : ""}`}>
            <span className="CoinPicker-row-avatar">
                {!imgFailed && coin.image
                    ? <img src={coin.image} alt="" onError={() => setImgFailed(true)} />
                    : <span>{coin.coinSymbol.slice(0, 2)}</span>}
            </span>
            <span className="CoinPicker-row-text">
                <span className="CoinPicker-row-symbol">{coin.coinSymbol}</span>
                <span className="CoinPicker-row-name">{coin.name}</span>
            </span>
        </span>
    )
}
