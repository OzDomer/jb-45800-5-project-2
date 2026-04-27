export default interface RecommendationPayload {
    verdict: "buy" | "don't buy"
    explanation: string
    flavor: string
}