import type RecommendationPayload from "./RecommendationPayload";

export type Recommendation =
       | { status: "loading" }
       | { status: "success", data: RecommendationPayload }
       | { status: "error", message: string }