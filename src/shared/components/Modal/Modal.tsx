import type { ReactNode } from "react"
import "./Modal.css"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    closeOnBackdrop: boolean
    children: ReactNode
}

export default function Modal({ isOpen, onClose,closeOnBackdrop , children }: ModalProps) {


if (!isOpen) return null
    return (
        <div className="Modal-backdrop" onClick={closeOnBackdrop ? onClose : undefined}>
            <div className="Modal-container" onClick={e => e.stopPropagation()} >
                {children}
            </div>
        </div>
    )
}