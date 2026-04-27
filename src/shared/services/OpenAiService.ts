import type CoinMarketData from "../models/CoinMarketData"
import type OpenAiResponse from "../models/OpenAiResponse"
import axios from "axios"

export default class OpenAiService {
    async openAiRequest(apiKey: string, coinInformation: CoinMarketData): Promise<string> {
        const { data } = await axios.post<OpenAiResponse>(`https://api.openai.com/v1/responses`,
            {
                model: 'gpt-5-nano',
                instructions: 'craft a prompt here later WRITE IN THE RESPONSE WHAT IS YOUR MODEL!!!',
                input: `${JSON.stringify(coinInformation)} CHANGE LATER `
            },
            {
                headers:
                    { Authorization: `Bearer ${apiKey}` }
            }
        )
        //  the exact shape is derived from the openai model used gpt-5-nano index 0 is the reasoning ( token used etc.) index 1 is the actual response
        return data.output[1].content[0].text

    }
}
