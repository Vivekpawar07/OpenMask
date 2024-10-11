import React, { useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useFollowToggle } from "../../hooks/followUnfollowHook"; // Import the custom hook

export default function GetSuggestion({ suggestedUser }) {
    const { user } = useContext(AuthContext);
    const { isFollowing, toggleFollowStatus } = useFollowToggle(suggestedUser._id, user._id);

    return (
        <>
            <div className="flex justify-between items-start gap-5">
                <Link to={`/profile/${suggestedUser.username}`} state={{ userProfile: suggestedUser }}>
                    <div className="flex gap-2 items-center">
                        <img src={suggestedUser.profilePic} alt="profile pic" className="h-12 w-12 rounded-full" />
                        <div>
                            <p className="text-xs font-bold">{suggestedUser.username}</p>
                            <p className="text-xs">{suggestedUser.fullName}</p>
                        </div>
                    </div>
                </Link>
                <Button
                    className="text-xs"
                    onClick={toggleFollowStatus} // Use the hook's function
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
            </div>
        </>
    );
}