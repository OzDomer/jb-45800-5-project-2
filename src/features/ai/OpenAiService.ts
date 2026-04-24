import axios from "axios"
import type AiRecommendation from "./AiRecommendation"

export default class OpenAiService {
    async openAiRequest(apiKey: string, coinInformation: AiRecommendation){
        try{
            const data = await axios.post(`https://api.openai.com/v1/responses`,
                {
                model: 'gpt-5',
                instructions: 'craft a prompt here later',
                input: `${JSON.stringify(coinInformation)} CHANGE LATER `},
                            
               { 
                headers: 
                { Authorization: `Bearer ${apiKey}` } }
            )
            return data
        }
        catch(e){
            console.log(e)
        }
    }
}