import React, { useState,useEffect } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
export default function Suggestion(){
    const [username,setUsername] = useState('');
    const [fullName,setFullName] = useState('');
    const [profilePic,setprofilePic] = useState('');
    useEffect(()=>{
        setUsername(localStorage.getItem('username'));
        setFullName(localStorage.getItem('fullName'));
        setprofilePic(localStorage.getItem('profilePicture'));
    },[])
    return(
        <>
        <div className="fixed h-[100%] flex flex-col gap-5 justify-self-end w-[15%] bg-custom_grey p-2">
            <div className="flex h-[60px] w-full items-center justify-evenly">
            <SettingsIcon/>
            <div className="flex items-center gap-2">
                <p>{username}</p>
                <img src={`${process.env.REACT_APP_BACKEND_SERVER_URL}/profile_picture/${profilePic}`} alt="profile picture" 
                className="rounded-full h-[45px] w-[45px]"/>
            </div>
            </div>
            <div>
               <h1 className="text-xm font-bold">Suggestions For you</h1>
            </div>
        </div>
        </>
    )
}