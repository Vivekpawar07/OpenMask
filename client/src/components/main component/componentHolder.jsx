import {React, useContext}  from "react";
import Nav from "./nav";
import Suggestion from "./suggestion";
import SearchBar from "./searchbar";
export default function Main(){
    return(
        <>
        <div className="grid grid-cols-3">
        <Nav/>
        <SearchBar/>
        <Suggestion/>
        </div>
        </>
    )
}