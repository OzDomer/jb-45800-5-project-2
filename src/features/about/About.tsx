import { Link } from "react-router-dom"
import { Code2, ExternalLink, Cpu, Database, Map, AlertTriangle, User } from "lucide-react"
import "./About.css"

const STACK = [
    { name: "typescript", ver: "6.0", note: "strict" },
    { name: "react", ver: "19.2", note: "client" },
    { name: "@reduxjs/toolkit", ver: "2.11", note: "store" },
    { name: "react-router-dom", ver: "7.14", note: "routing" },
    { name: "recharts", ver: "3.8", note: "/signal" },
    { name: "axios", ver: "1.15", note: "http" },
    { name: "vite", ver: "8.0", note: "build" },
    { name: "lucide-react", ver: "—", note: "icons" },
    { name: "@fontsource/jetbrains-mono", ver: "—", note: "type" },
]

const SOURCES = [
    {
        host: "coingecko",
        path: "/coins/markets · /coins/{id}",
        purpose: "market list + per-coin detail",
        auth: "public",
    },
    {
        host: "cryptocompare",
        path: "/price/multi",
        purpose: "live USD samples · 1s interval",
        auth: "public",
    },
    {
        host: "openai",
        path: "/v1/responses · gpt-5-nano",
        purpose: "verdict, case, lore",
        auth: "bearer · local key",
    },
]

const ROUTES = [
    { path: "/home (alias /)", view: "MARKET", desc: "top 100 list, watchlist toggles" },
    { path: "/reports", view: "SIGNAL", desc: "live price feed, 10-min window" },
    { path: "/ai", view: "ORACLE", desc: "buy / don't-buy on watchlist" },
    { path: "/about", view: "DOSSIER", desc: "this page" },
    { path: "/*", view: "—", desc: "segfault · 404" },
]

export default function About() {
    return (
        <div className="About">
            <header className="About-hero">
                <div className="About-hero-tag">
                    <span className="pulse-dot" />
                    <span>SYSTEM · cryptonite v1.0</span>
                </div>
                <h1 className="page-heading striped About-title">
                    <span className="slash">//&nbsp;</span>DOSSIER
                </h1>
                <p className="About-tagline">
                    Cryptonite is a real-time crypto terminal — track up to 5 coins,
                    watch prices stream, get an AI take. Built as a learning project
                    in TypeScript and React.
                </p>
            </header>

            {/* ---- stack ---- */}
            <Section icon={<Cpu size={11} strokeWidth={2.25} />} label="stack" count={STACK.length}>
                <ul className="About-stack">
                    {STACK.map(p => (
                        <li key={p.name} className="About-stack-row">
                            <span className="About-stack-name">{p.name}</span>
                            <span className="About-stack-rule" aria-hidden />
                            <span className="About-stack-ver">{p.ver}</span>
                            <span className="About-stack-note">{p.note}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* ---- data sources ---- */}
            <Section icon={<Database size={11} strokeWidth={2.25} />} label="data sources" count={SOURCES.length}>
                <ul className="About-sources">
                    {SOURCES.map(s => (
                        <li key={s.host} className="About-source">
                            <span className="About-source-host">{s.host}</span>
                            <span className="About-source-path">{s.path}</span>
                            <span className="About-source-purpose">{s.purpose}</span>
                            <span className={`About-source-auth ${s.auth.startsWith("bearer") ? "is-secure" : ""}`}>
                                {s.auth}
                            </span>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* ---- routes ---- */}
            <Section icon={<Map size={11} strokeWidth={2.25} />} label="routes" count={ROUTES.length}>
                <table className="About-routes">
                    <thead>
                        <tr>
                            <th>path</th>
                            <th>view</th>
                            <th>description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ROUTES.map(r => (
                            <tr key={r.path}>
                                <td><code>{r.path}</code></td>
                                <td className="About-routes-view">{r.view}</td>
                                <td>{r.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            {/* ---- engineer ---- */}
            <Section icon={<User size={11} strokeWidth={2.25} />} label="engineer">
                <div className="About-engineer">
                    <div className="About-engineer-avatar" aria-hidden>
                        <AnonAvatar />
                        <span className="About-engineer-avatar-corner is-tl" />
                        <span className="About-engineer-avatar-corner is-br" />
                    </div>
                    <div className="About-engineer-meta">
                        <ul className="About-engineer-lines">
                            <li>
                                <span className="About-engineer-bullet">{">"}</span>
                                <span>Oz Domer · 25 · student</span>
                            </li>
                            <li>
                                <span className="About-engineer-bullet">{">"}</span>
                                <span>john bryce · 45800-5</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* ---- notes / disclaimer ---- */}
            <section className="About-notes">
                <header className="About-notes-head">
                    <span className="About-notes-icon">
                        <AlertTriangle size={11} strokeWidth={2.25} />
                    </span>
                    <span className="caps">notes</span>
                    <span className="About-notes-rule" aria-hidden />
                </header>
                <ul className="About-notes-list">
                    <li>
                        <span className="About-notes-bullet">{">"}</span>
                        <span>Outputs from the oracle are <strong>not financial advice.</strong></span>
                    </li>
                    <li>
                        <span className="About-notes-bullet">{">"}</span>
                        <span>API keys live only in your browser's localStorage, sent only to OpenAI.</span>
                    </li>
                    <li>
                        <span className="About-notes-bullet">{">"}</span>
                        <span>No analytics, no tracking. The terminal sees nothing.</span>
                    </li>
                    <li>
                        <span className="About-notes-bullet">{">"}</span>
                        <span>Watchlist persists across reloads via localStorage.</span>
                    </li>
                </ul>
            </section>

            {/* ---- footer-ish ---- */}
            <footer className="About-foot">
                <Link to="/home" className="About-foot-link">
                    <span>↩ back to market</span>
                </Link>
                <a
                    href="https://github.com/OzDomer/jb-45800-5-project-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="About-foot-link"
                >
                    <Code2 size={12} strokeWidth={1.75} />
                    <span>source</span>
                    <ExternalLink size={10} strokeWidth={2} />
                </a>
            </footer>
        </div>
    )
}

/* ----------- subcomponents ----------- */

interface SectionProps {
    icon: React.ReactNode
    label: string
    count?: number
    children: React.ReactNode
}
function Section({ icon, label, count, children }: SectionProps) {
    return (
        <section className="About-section">
            <header className="About-section-head">
                <span className="About-section-icon">{icon}</span>
                <span className="caps About-section-label">{label}</span>
                {count != null && (
                    <span className="About-section-count">[ {String(count).padStart(2, "0")} ]</span>
                )}
                <span className="About-section-rule" aria-hidden />
            </header>
            <div className="About-section-body">{children}</div>
        </section>
    )
}

/* Anonymous operator avatar — hooded silhouette with redacted eye bar.
   Inline SVG keeps the cypherpunk vibe consistent with the brand mark. */
function AnonAvatar() {
    return (
        <svg
            className="About-engineer-svg"
            viewBox="0 0 64 64"
            width="64"
            height="64"
            aria-hidden
        >
            <path
                d="M4 60 C 4 46, 18 42, 32 42 C 46 42, 60 46, 60 60 L 60 64 L 4 64 Z"
                className="anon-shoulders"
            />
            <path
                d="M16 28 C 16 14, 22 6, 32 6 C 42 6, 48 14, 48 28 L 48 38 C 48 42, 42 46, 32 46 C 22 46, 16 42, 16 38 Z"
                className="anon-hood"
            />
            <path
                d="M22 30 C 22 22, 26 18, 32 18 C 38 18, 42 22, 42 30 L 42 38 C 42 41, 38 43, 32 43 C 26 43, 22 41, 22 38 Z"
                className="anon-face"
            />
            <rect x="20" y="28" width="24" height="6" className="anon-bar" />
            <path d="M0 0 H4 M0 0 V4" className="anon-tick" strokeWidth="1" fill="none" />
            <path d="M64 0 H60 M64 0 V4" className="anon-tick" strokeWidth="1" fill="none" />
            <path d="M0 64 H4 M0 64 V60" className="anon-tick" strokeWidth="1" fill="none" />
            <path d="M64 64 H60 M64 64 V60" className="anon-tick" strokeWidth="1" fill="none" />
        </svg>
    )
}
