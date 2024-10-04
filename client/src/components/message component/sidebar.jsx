import React,{useContext,useEffect,useState} from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import UserToChat from "./msgComp";
import { AuthContext } from "../../context/AuthContext";
export default function Sidebar(){
    const { user } = useContext(AuthContext);
    useEffect(()=>{
        const getPreviousUser = async()=>{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/chat/${user._id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json()
            console.log(data)
        }
        getPreviousUser();
    },[])
    return(
        <>
        <div className=" flex flex-col gap-3 h-[85vh] w-[30%] p-2 bg-custom_grey rounded-2xl overflow-scroll">
            {/* search bar */}
            <div 
            className="flex items-center  border-[1px] border-custom_grey  
             gap-2 justify-start rounded-2xl p-1 shadow-inner
              shadow-white" style={{   
                 boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
              }}>
                <SearchRoundedIcon className="text-white"/>
                <input type="text" placeholder="Search..." 
                className="bg-transparent h-[30px] w-full border-none outline-none text-white "  />
            </div>
            <div>
                <p className="ml-2 text-xs font-semibold">Messages</p>
            </div>
            <div className="flex flex-col gap-3">
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/> 
            </div>
            <div>
                suggested user
            </div>
            <div className="ml-2 text-xs font-semibold">
            <UserToChat/>
              <UserToChat/>
              <UserToChat/>
              <UserToChat/> 
            </div>
        </div>
        </>
    )
}