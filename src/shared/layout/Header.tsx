import { NavLink } from "react-router-dom"
import { Moon, Sun, Activity } from "lucide-react"
import "./Header.css"
import { useTheme } from "../hooks/useTheme"

const NAV = [
    { to: "/home",    label: "MARKET"  },
    { to: "/reports", label: "SIGNAL"  },
    { to: "/ai",      label: "ORACLE"  },
    { to: "/about",   label: "DOSSIER" },
]

export default function Header() {
    const { theme, toggleTheme } = useTheme()
    const nextTheme = theme === "dark" ? "light" : "dark"

    return (
        <header className="Header">
            <div className="Header-inner">
                <NavLink to="/home" className="Header-brand" aria-label="Cryptonite home">
                    <BrandMark />
                    <span className="Header-brand-name">CRYPTONITE</span>
                    <span className="Header-brand-tag">// terminal · v1.0</span>
                </NavLink>

                <nav className="Header-nav" aria-label="primary">
                    {NAV.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                "Header-nav-link" + (isActive ? " is-active" : "")
                            }
                        >
                            <span className="Header-nav-bracket">[</span>
                            <span className="Header-nav-label">{label}</span>
                            <span className="Header-nav-bracket">]</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="Header-meta">
                    <span className="Header-status" title="connection status">
                        <Activity size={11} strokeWidth={2.5} />
                        <span>LIVE</span>
                    </span>
                    <button
                        type="button"
                        className="Header-theme"
                        onClick={toggleTheme}
                        aria-label={`switch to ${nextTheme} mode`}
                        title={`theme: ${theme} → ${nextTheme}`}
                    >
                        {theme === "dark"
                            ? <Moon size={14} strokeWidth={1.75} />
                            : <Sun  size={14} strokeWidth={1.75} />}
                    </button>
                </div>
            </div>
            <div className="Header-rule" aria-hidden />
        </header>
    )
}

/* Custom diamond brand mark — pulsing core + corner ticks. */
function BrandMark() {
    return (
        <svg
            className="Header-brand-mark"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            aria-hidden
        >
            <path d="M10 2 L18 10 L10 18 L2 10 Z" className="bm-stroke" fill="none" strokeWidth="1.25" />
            <path d="M10 6 L14 10 L10 14 L6 10 Z" className="bm-fill" />
            <path d="M0 0 H4 M0 0 V4"  className="bm-tick" strokeWidth="1" fill="none" />
            <path d="M20 0 H16 M20 0 V4" className="bm-tick" strokeWidth="1" fill="none" />
            <path d="M0 20 H4 M0 20 V16" className="bm-tick" strokeWidth="1" fill="none" />
            <path d="M20 20 H16 M20 20 V16" className="bm-tick" strokeWidth="1" fill="none" />
        </svg>
    )
}
