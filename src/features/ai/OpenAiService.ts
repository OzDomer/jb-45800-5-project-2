import axios, { type AxiosResponse } from "axios"
import type AiRecommendation from "./AiRecommendation.ts"
import type OpenAiResponse from "./OpenAiResponse.ts"

export default class OpenAiService {
    async openAiRequest(apiKey: string, coinInformation: AiRecommendation): Promise<AxiosResponse<OpenAiResponse> | null>{
        try{
            const data = await axios.post<OpenAiResponse>(`https://api.openai.com/v1/responses`,
                {
                model: 'gpt-5-nano',
                instructions: 'craft a prompt here later WRITE IN THE RESPONSE WHAT IS YOUR MODEL!!!',
                input: `${JSON.stringify(coinInformation)} CHANGE LATER `},
                            
               { 
                headers: 
                { Authorization: `Bearer ${apiKey}` } }
            )
            return data
        }
        catch(e){
            console.error(e)
            return null
        }
    }
}