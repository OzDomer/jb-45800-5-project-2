export type Recommendation =
       | { status: "loading" }
       | { status: "success", text: string }
       | { status: "error", message: string }