import {React, useContext}  from "react";
import Nav from "./main component/nav";
import Suggestion from "./main component/suggestion";
import SearchBar from "./main component/searchbar";
import { AuthContext } from '../context/AuthContext';
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