import React from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Button } from "@mui/material";
export default function SearchBar(){
    return(
        <>
        <div className="fixed flex items-center gap-5  bg-custom_grey text-black ml-[15%] w-[70%] h-[60px] overflow-hidden">
            <div 
            className="flex items-center ml-10 border-[1px] border-custom_grey  w-[40%]
             gap-2 justify-start rounded-2xl p-1 shadow-inner
              shadow-white" style={{   
                 boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
              }}>
                <SearchRoundedIcon className="text-white"/>
                <input type="text" placeholder="Search..." 
                className="bg-transparent h-[30px] w-full border-none outline-none text-white "  />
            </div>
            <Button variant="contained" 
            sx={{ float:'left', width: '180px', borderRadius: '20px', bgcolor: '#3a6f98',fontSize:"12px" }}> Search with image</Button>
        </div>
        </>
    )
}