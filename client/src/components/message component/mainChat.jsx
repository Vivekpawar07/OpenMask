import React from "react";
import Poster from "../../images/LoginPoster.png"
import Divider from '@mui/material/Divider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
export default function Chat(){
    return(
        <>
        <div className="h-[85vh] w-[60%] bg-custom_grey rounded-2xl flex flex-col p-3 gap-3">
            {/* this is the header */}
            <div className="flex gap-2">
                <img src={Poster} alt=""className="rounded-full h-12 w-12" />
                <div className="">
                <p className="text-xs font-semibold">username</p>
                <p className="text-xs "> full name</p>
                </div>
            </div>
            <Divider sx={{borderColor:'white'}} />
            {/* this is chat comp */}
            <div className="h-[82%] flex flex-col overflow-scroll">
                <div className="chat chat-start">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <div className="chat-bubble">It was said that you would, destroy the Sith, not join them.</div>
                    </div>
                    <div className="chat chat-start">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <div className="chat-bubble">It was you who would bring balance to the Force</div>
                    </div>
                    <div className="chat chat-end">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <div className="chat-bubble">Not leave it in Darkness</div>
                </div>
            </div>
            {/* text input */}
            <div className="flex items-center  border-[1px] border-custom_grey  
             gap-2 justify-start rounded-2xl p-1 shadow-inner px-1
              shadow-white" style={{   
                boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
             }}>
            <InsertPhotoIcon/>
                <input type="text"  placeholder="text" className="bg-transparent h-[30px] w-full border-none outline-none text-white"/>
                <button type="button" class="text-white bg-custom_blue    font-xs rounded-full text-sm px-5 py-2.5 text-center dark:bg-custom_blue">send</button>
                <button type="button" class="text-white bg-custom_blue    font-xs rounded-full text-sm px-5 py-2.5 text-center  dark:bg-custom_blue">enhance</button>
                <button type="button" class="text-white bg-custom_blue    font-xs rounded-full text-sm px-5 py-2.5 text-center  dark:bg-custom_blue">style</button>
            </div>

        </div>
        </>
    )
}