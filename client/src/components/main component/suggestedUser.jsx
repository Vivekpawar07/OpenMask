import React, { useState, useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export default function GetSuggestion({ suggestedUser }) {
    const [isFollowing, setIsFollowing] = useState(false); 
    const {user} = useContext(AuthContext);
    
    const handleFollowToggle = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/follow/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`, 
                },
                body: JSON.stringify({ _id: suggestedUser._id })
                
            });

            if (response.ok) {
                const newFollowStatus = !isFollowing;
                setIsFollowing(newFollowStatus);
            } else {
                throw new Error('Failed to update follow status');
            }
        } catch (error) {
            console.error("Error following/unfollowing user:", error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-start gap-5">
                <div className="flex gap-2 items-center">
                    <img src={suggestedUser.profilePic} alt="profile pic" className="h-12 w-12 rounded-full" />
                    <div>
                        <p className="text-xs font-bold">{suggestedUser.username}</p>
                        <p className="text-xs">{suggestedUser.fullName}</p>
                    </div>
                </div>
                <Button 
                    className="text-xs" 
                    onClick={handleFollowToggle}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'} 
                </Button>
            </div>
        </>
    );
}