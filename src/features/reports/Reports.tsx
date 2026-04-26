import { useEffect, useState } from "react"
import { useAppSelector } from "../../shared/store/hooks"
import CryptoCompareService from "./CryptoCompareService"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"
import "./Reports.css"

export default function Reports() {

    const userCoins = useAppSelector(state => state.userCoinsSlice.userCoins)
    const [arrayForGraph, setArrayForGraph] = useState<{ [key: string]: string | number }[]>([])


    useEffect(() => {
        if (userCoins.length !== 0) {
            const intervalId = setInterval(() => {
                (async function () {
                    const response = await new CryptoCompareService().getCoinPriceRt(userCoins.map(coin => coin.coinSymbol))
                    if (response) {
                        const entry: { [key: string]: string | number } = { time: new Date().toLocaleTimeString() }
                        Object.keys(response).forEach(key => {
                            entry[key] = response[key].USD
                        })
                        setArrayForGraph(arrayForGraph => [...arrayForGraph, entry].slice(-120))
                    }
                })()

            }, 5 * 1000)


            return () => {
                clearInterval(intervalId)
            }
        }
    }, [userCoins])

    return (
        <>
            <LineChart width={800} height={400} data={arrayForGraph}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {userCoins.map(coin => (
                    <Line
                        key={coin.coinSymbol}
                        type="monotone"
                        dataKey={coin.coinSymbol}
                        stroke="#8884d8"
                    />
                ))}
            </LineChart>
        </>
    )
}