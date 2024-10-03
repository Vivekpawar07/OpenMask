import React from "react";
import EventComp from "./event/eventComp";
import News from "./event/news";
export default function Event(){
    return(
        <>
        <div className="w-[23%] h-[690px] rounded-2xl flex flex-col gap-3 fixed z-10">
        <EventComp/>
        <News/>
        </div>
        </>
    )
}