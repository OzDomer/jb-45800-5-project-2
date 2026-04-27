import { NavLink } from "react-router-dom"
import "./Header.css"
import { useTheme } from "../hooks/useTheme"

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="Header">
            HEADER RARHAHRHAR
            <div className="NavLinks">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/reports">Reports</NavLink>
                <NavLink to="/ai">Ai Recommendations</NavLink>
                <NavLink to="/about">About</NavLink>
                <button onClick={toggleTheme}>Toggle {theme}</button>
            </div>
        </div>
    )
}