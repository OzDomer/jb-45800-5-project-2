export default interface OpenAiResponse {
    output: (
        | { type: "message"; content: { text: string }[] }
        | { type: "reasoning" }
    )[]

}