import type { ReactNode } from "react"
import "./Modal.css"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {


if (!isOpen) return null
    return (
        <div className="Modal-backdrop" onClick={onClose}>
            <div className="Modal-container" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}