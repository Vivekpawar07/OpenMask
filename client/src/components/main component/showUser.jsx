import React from "react";
import { useNavigate } from "react-router-dom";
export default function Show({user, onUserSelect}){
    const navigate = useNavigate();
    const getProfile = ()=>{
        navigate(`/profile/${user.username}` ,{ state: { userProfile: user } });
        onUserSelect();
        
    }
    return (
        <>
        <div className="flex w-full rounded-xl bg-custom_grey p-2 gap-2" onClick={getProfile}>
            <div className="rounded-full overflow-hidden">
                <img src={user.profilePic} alt="" className="h-12 w-12" />
            </div>
            <div>
                <h1>{user.username}</h1>
                <p>{user.fullname}</p>
            </div>
        </div>
        </>
    );
}