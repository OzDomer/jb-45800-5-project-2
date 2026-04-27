import { useEffect, useRef, useState } from "react"
import { getItemFromStorage, saveToStorage } from "../utils/storage"

type Theme = "light" | "dark"
const STORAGE_KEY = "cryptonite:theme"



export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => getItemFromStorage<Theme>(STORAGE_KEY, "dark"))
    // using useref for first run since theme already being initialized on boot  
    const isFirstRun = useRef(true)
    useEffect(() => {
        document.documentElement.dataset.theme = theme
        if(!isFirstRun.current){
        saveToStorage(STORAGE_KEY, theme)
        }
        isFirstRun.current = false
    },[theme])

    function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark")
}

    return { theme, toggleTheme }
}