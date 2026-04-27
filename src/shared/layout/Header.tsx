import { NavLink } from "react-router-dom"
import "./Header.css"

export default function Header() {

    return(
        <div className="Header">
        HEADER RARHAHRHAR
        <div className="NavLinks">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/ai">Ai Recommendations</NavLink>
            <NavLink to="/about">About</NavLink>
        </div>
        </div>
        )
}