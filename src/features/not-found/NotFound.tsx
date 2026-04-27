import { Link, useLocation } from "react-router-dom"
import { Skull, ArrowRight } from "lucide-react"
import "./NotFound.css"

export default function NotFound() {
    const location = useLocation()
    return (
        <div className="NotFound">
            <div className="NotFound-frame corner-frame">
                <span className="cf-tr" /><span className="cf-bl" />

                <div className="NotFound-glitch" data-text="404">
                    <span aria-hidden>404</span>
                </div>

                <div className="NotFound-headline">
                    <Skull size={14} strokeWidth={2.25} />
                    <span className="caps">segmentation fault · core dumped</span>
                </div>

                <pre className="NotFound-trace">{`$ cryptonite resolve --route="${location.pathname}"

panic: route not found
goroutine 1 [running]:
  cryptonite.routeMatch(${JSON.stringify(location.pathname)})
        /cryptonite/router.tsx:42 +0x9b
  cryptonite.layout.Outlet()
        /cryptonite/shared/layout/Layout.tsx:13 +0x12
  main.main()
        /cryptonite/main.tsx:8 +0x6c

exit status 11`}
                </pre>

                <div className="NotFound-actions">
                    <Link to="/home" className="NotFound-cta">
                        <span>kill process · return to market</span>
                        <ArrowRight size={12} strokeWidth={2} />
                    </Link>
                </div>

                <div className="NotFound-prompt" aria-hidden>
                    <span className="NotFound-prompt-user">root@cryptonite</span>
                    <span className="NotFound-prompt-sep">:</span>
                    <span className="NotFound-prompt-path">~</span>
                    <span className="NotFound-prompt-sigil">$</span>
                    <span className="NotFound-prompt-caret" />
                </div>
            </div>
        </div>
    )
}
