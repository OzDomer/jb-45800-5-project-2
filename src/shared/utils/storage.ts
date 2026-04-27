export function getItemFromStorage<T>(key: string, fallback: T) {
    try {
        const raw = localStorage.getItem(key)
        if (raw === null) return fallback
        return JSON.parse(raw) as T
    } catch (e) {
        console.error(e)
        return fallback
    }
}
export function saveToStorage<T>(key: string, value: T) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error(e)
    }
}
