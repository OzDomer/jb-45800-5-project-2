import "./Footer.css"

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="Footer" aria-label="status">
            <div className="Footer-rule" aria-hidden />
            <div className="Footer-inner">
                <div className="Footer-cluster">
                    <span className="Footer-tag">[ NORMAL ]</span>
                    <span className="Footer-text Footer-text--mute">
                        ~ /cryptonite — main · clean
                    </span>
                </div>
                <div className="Footer-cluster Footer-cluster--center">
                    <span className="Footer-text Footer-text--mute">
                        coingecko · cryptocompare · openai
                    </span>
                </div>
                <div className="Footer-cluster Footer-cluster--right">
                    <span className="Footer-text Footer-text--mute">
                        © {year} cryptonite ·
                    </span>
                    <span className="Footer-tag Footer-tag--accent">utf-8</span>
                    <span className="Footer-tag">ln 1, col 1</span>
                </div>
            </div>
        </footer>
    )
}
