import React from "react";
export default function EventComp(){
    return(
        <>
        <div className=" flex flex-col gap-2 w-full bg-custom_grey h-[350px] rounded-2xl p-3 z-20">
            <h1 className="text-xl font-bold">Events near you</h1>
            <div>
                <p>title</p>
                <p>content</p>
            </div>
        </div>
        </>
    )
}