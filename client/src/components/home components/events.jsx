import React from "react";
import EventComp from "./event/eventComp";
export default function Event(){
    return(
        <>
        <div className="w-[23%] h-[828px] rounded-2xl flex flex-col gap-3 fixed z-10">
        <EventComp/>
        </div>
        </>
    )
}