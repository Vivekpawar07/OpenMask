import { useState } from "react";

export const useFollowToggle = (suggestedUserId, userId) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const toggleFollowStatus = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/follow/${suggestedUserId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ _id: userId })
            });

            if (response.ok) {
                setIsFollowing(prevState => !prevState);  // Toggle follow status
            } else {
                throw new Error('Failed to update follow status');
            }
        } catch (error) {
            console.error("Error following/unfollowing user:", error);
        }
    };

    return { isFollowing, toggleFollowStatus };
};