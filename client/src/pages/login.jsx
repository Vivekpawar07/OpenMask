import React from "react";
import poster from "../images/poster.png"
import Button from "@mui/material/Button"
import Send from "@mui/icons-material/Send";
export default function Login(){
    return(
        <>
        <div className="h-[100vh] gap-10 w-[100wh] flex justify-center items-center p-20">
            {/* Poster div */}
            <div className="">
                <img src={poster} alt="" className="h-72 w-72" />
            </div>
            {/* Form */}
            <form action="" className="flex w-40% h-100% capitalize">
            <div className="w-40% h-100% flex flex-col">
                 <div className="">
                    <h1 className="text-2xl font-extrabold">Login</h1>
                    <p className="text-sm font-semibold">Stay bold, stay anonymous</p>
                 </div>
                 <div>
                
                    <Button variant="contained" endIcon={<Send />}>
                        Send
                    </Button>
                 </div>
            </div>

            </form>

        </div>
        </>
    )
}