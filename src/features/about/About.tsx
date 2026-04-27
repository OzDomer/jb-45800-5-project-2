import { Link } from "react-router-dom"
import { Code2, ExternalLink, Cpu, Database, Map, AlertTriangle } from "lucide-react"
import "./About.css"

const STACK = [
    { name: "typescript",                  ver: "6.0",   note: "strict" },
    { name: "react",                       ver: "19.2",  note: "client" },
    { name: "@reduxjs/toolkit",            ver: "2.11",  note: "store" },
    { name: "react-router-dom",            ver: "7.14",  note: "routing" },
    { name: "recharts",                    ver: "3.8",   note: "/signal" },
    { name: "axios",                       ver: "1.15",  note: "http" },
    { name: "vite",                        ver: "8.0",   note: "build" },
    { name: "lucide-react",                ver: "—",     note: "icons" },
    { name: "@fontsource/jetbrains-mono",  ver: "—",     note: "type" },
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
        purpose: "live USD samples · 5s interval",
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
    { path: "/home (alias /)", view: "MARKET",  desc: "top 100 list, watchlist toggles" },
    { path: "/reports",        view: "SIGNAL",  desc: "live price feed, 10-min window" },
    { path: "/ai",             view: "ORACLE",  desc: "buy / don't-buy on watchlist" },
    { path: "/about",          view: "DOSSIER", desc: "this page" },
    { path: "/*",              view: "—",       desc: "segfault · 404" },
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
