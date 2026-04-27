import { useState } from "react"
import type { SelectedCoin } from "../../store/user-coins-slice"
import Modal from "../Modal/Modal"
import "./CoinPickerModal.css"

interface CoinPickerModalProps {
    onClose: () => void
    onConfirm: (selectedIds: string[]) => void
    coinsToChooseFrom: SelectedCoin[]
    pendingCoin: SelectedCoin
}

export default function CoinPickerModal({ onClose, onConfirm, coinsToChooseFrom, pendingCoin }: CoinPickerModalProps) {
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

    return (
            <Modal isOpen={true} onClose={handleCancel}>
                <h3>Watchlist full — pick coin(s) to remove to add {pendingCoin.name}</h3>
                {coinsToChooseFrom.map(coin => <label key={coin.coinId}><input type="checkbox" checked={selected.includes(coin.coinId)} onChange={() => toggle(coin.coinId)}/>{coin.name}</label>)}
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleConfirm}>Confirm</button>
            </Modal>

    )
}