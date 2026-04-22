import { NavLink } from "react-router-dom"
import "./Header.css"

    interface HeaderProps{
        searchTerm: string,
        setSearchTerm: React.Dispatch<React.SetStateAction<string>>
        }

export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {

    return(
        <div className="Header">
        HEADER RARHAHRHAR
        <div className="NavLinks">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/ai">Ai Recommendations</NavLink>
            <NavLink to="/about">About</NavLink>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        </div>
        )
}