import { Outlet } from "react-router-dom"
import "./Layout.css"
import Header from "./Header"
import Footer from "./Footer"
import { useState } from "react"

export default function Layout() {
   const [searchTerm, setSearchTerm]= useState<string>("")
    
    return (
        <div>
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <Outlet context={searchTerm} />
        <Footer />
        </div>
    )
}