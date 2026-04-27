import { useEffect, useState } from "react"
import { getItemFromStorage, saveToStorage } from "../utils/storage"

type Theme = "light" | "dark"
const STORAGE_KEY = "cryptonite:theme"



export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => getItemFromStorage<Theme>(STORAGE_KEY, "dark"))

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        saveToStorage(STORAGE_KEY, theme)
    },[theme])

    function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark")
}

    return { theme, toggleTheme }
}