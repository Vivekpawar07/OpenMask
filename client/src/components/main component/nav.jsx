import React, { useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import ExploreIcon from '@mui/icons-material/Explore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Link, useNavigate } from "react-router-dom";
import CreatePost from "./createPost";

export default function Nav() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <div className="h-[100%] w-[15%] fixed flex-shrink flex flex-col justify-start gap-8 flex-wrap py-5 p-2 bg-custom_grey">
            <h1 className="text-2xl font-bold text-white">OpenMask</h1>
            <div className="flex flex-col gap-5">
                <Link to='/home'>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <HomeIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Home</p>
                </div>
                </Link>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <AccountCircleRoundedIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Anonymous</p>
                </div>
                <Link to='/message'>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <MessageIcon className="text-white text-xs" />
                    <p className="text-white text-xs">Message</p>
                </div>
                </Link>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <ExploreIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Explore</p>
                </div>
                {/* AddCircleIcon triggers the CreatePost popup */}
                <div 
                    className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700"
                    onClick={openPopup}
                >
                    <AddCircleIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Create Post</p>
                </div>
                <Link to='/notification'>
                <div className="flex gap-2 h-[30px] w-[160px] p-2 justify-start items-center rounded-xl transition-colors duration-300 hover:bg-gray-700">
                    <NotificationsIcon className="text-white text-xs"/>
                    <p className="text-white text-xs">Notifications</p>
                </div>
                </Link>
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
                    <p className="text-white text-xs">Politics</p>
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
            {/* Render CreatePost popup */}
            {isPopupOpen && <CreatePost closePopup={closePopup} />}
        </div>
    );
}