import { useEffect, useState } from "react"
import "./MoreInfo.css"
import type MoreInformation from "../../shared/models/MoreInformation"
import CoinGeckoService from "../../shared/services/CoinGeckoService"


interface MoreInfoProps {
    coinId: string
}

export default function MoreInfo({ coinId }: MoreInfoProps) {

    const [coinInformation, setCoinInformation] = useState<MoreInformation | null>(null)

    useEffect(() => {
        (async function () {
            const response = await new CoinGeckoService().getMoreInfo(coinId)
            setCoinInformation(response)
        }
        )()
    }, [coinId]
    )
    4
    return (
        <div className="MoreInfo">
            usd: {coinInformation?.market_data.current_price.usd}
            eur: {coinInformation?.market_data.current_price.eur}
            nis: {coinInformation?.market_data.current_price.ils}
        </div>
    )
}