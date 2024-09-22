import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Nav() {
    const [username,setUsername ] = useState("");
    const [fullName,setFullName] = useState('');
    const [profilePic,setprofilePic] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        setUsername(localStorage.getItem('username'));
        setFullName(localStorage.getItem('fullName'));
        setprofilePic(localStorage.getItem('profilePicture'));

    },[])
    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('profilePicture');
        localStorage.removeItem('token');
        
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };
    return (
        <div className="h-[100%] w-[15%] fixed flex-shrink flex flex-col justify-start gap-8 flex-wrap py-5 p-2 bg-custom_grey">
            <h1 className="text-2xl font-bold text-white">OpenMask</h1>
            <div className="flex flex-col gap-5">
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <HomeIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Home</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AccountCircleRoundedIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Anonymous</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <MessageIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Message</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <ExploreIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Explore</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AddCircleIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Create Post</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <NotificationsIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Notifications</p>
                </div>
            </div>
            <hr />
            <div className="flex flex-col gap-5">
                <p className="text-white text-xs font-bold">Anonymous Public Groups</p>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AccountCircleRoundedIcon className="text-white text-xs" />
                    <p className="text-white text-xs font-bold">Tech</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AccountCircleRoundedIcon className="text-white text-xs" />
                    <p className="text-white text-xs">Cricket</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AccountCircleRoundedIcon className="text-white text-xs" />
                    <p className="text-white text-xs">Politicses</p>
                </div>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AccountCircleRoundedIcon className="text-white text-xs" />
                    <p className="text-white text-xs">Social Awareness</p>
                </div>
            </div>
            <div>
            <div className="flex gap-2 mt-16 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700" 
            onClick={logout}>
                    <LogoutIcon className="text-white text-xs" />
                    <p className="text-white text-xs">Logout</p>
                </div>
            </div>
        </div>
    );
}