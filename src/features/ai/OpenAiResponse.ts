export default interface OpenAiResponse {
    output: {
        content: {
            text: string
        }[]
    }[]
}