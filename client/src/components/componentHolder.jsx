import React from "react";
import Nav from "./main component/nav";
import Suggestion from "./main component/suggestion";
import SearchBar from "./main component/searchbar";
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