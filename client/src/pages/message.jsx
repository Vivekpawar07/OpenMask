import React from "react";
import Sidebar from "../components/message component/sidebar";
import Chat from "../components/message component/mainChat";
export default  function Messages(){
    return(
        <>
        <div className='flex  gap-6 w-[70%] mt-[80px] ml-[17%] mr-[15%]'>
        <Sidebar/>
        <Chat/>
        </div>
        
        </>
    )
}