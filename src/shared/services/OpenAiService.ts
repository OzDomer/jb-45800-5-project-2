import type CoinMarketData from "../models/CoinMarketData"
import type OpenAiResponse from "../models/OpenAiResponse"
import axios from "axios"
import type RecommendationPayload from "../models/RecommendationPayload"

const prompt =
    `You are a cryptocurrency investment advisor. You will receive market data about a coin in the user message. Analyze the data and respond with a recommendation, the recommendation is not real financial advice.
    Respond ONLY in raw JSON. No markdown, no code blocks, no backticks, no extra text. Just the JSON object.
    Your response MUST conform to the schema. The verdict field is 
    either 'buy' or 'don't buy' — no other values. The explanation field is 2-4 sentences analyzing price trends, 
    volume, and market cap, justifying the verdict. The flavor field is 1-2 sentences about the coin itself — 
    what it does, what makes it unique, an interesting fact.`

function coinMarketDataFormatter(data: CoinMarketData): string {
    return `Coin: ${data.name}
        Current price: $${data.market_data.current_price.usd.toLocaleString("en-US")}
        Market cap: $${data.market_data.market_cap.usd.toLocaleString("en-US")}
        Total volume: $${data.market_data.total_volume.usd.toLocaleString("en-US")}
        Price change in the last 30 days: ${data.market_data.price_change_percentage_30d_in_currency.usd.toFixed(2)}%
        Price change in the last 60 days: ${data.market_data.price_change_percentage_60d_in_currency.usd.toFixed(2)}%
        Price change in the last 200 days: ${data.market_data.price_change_percentage_200d_in_currency.usd.toFixed(2)}%
        `
}


class OpenAiService {
    async openAiRequest(apiKey: string, coinInformation: CoinMarketData): Promise<RecommendationPayload> {
        const { data } = await axios.post<OpenAiResponse>(`https://api.openai.com/v1/responses`,
            {
                model: 'gpt-5-nano',
                instructions: prompt,
                input: `${coinMarketDataFormatter(coinInformation)}`,
                text: {
                    format: {
                        type: "json_schema",
                        name: "recommendation_payload",
                        schema: {
                            type: "object",
                            properties: {
                                verdict: { type: "string", enum: ["buy", "don't buy"] },
                                explanation: { type: "string" },
                                flavor: { type: "string" }
                            },
                            required: ["verdict", "explanation", "flavor"],
                            additionalProperties: false
                        },
                    strict: true
                    }
                }
            },
            {
                headers:
                    { Authorization: `Bearer ${apiKey}` }
            },
        )
        //  the exact shape is derived from the openai model used gpt-5-nano index 0 is the reasoning ( token used etc.) index 1 is the actual response
        return JSON.parse(data.output[1].content[0].text) as RecommendationPayload

    }
}
export default new OpenAiService()