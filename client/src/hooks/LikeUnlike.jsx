import { useState } from 'react';

export const useLikeUnlike = (post, user) => {
    const [liked, setLiked] = useState(post.likes.includes(user._id));

    const likeUnlike = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/like/${post._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ _id: user._id })
            });

            if (response.ok) {
                setLiked(!liked); // Toggle the like state
                console.log("Like status updated");
            } else {
                console.error("Failed to update like status");
            }
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    return [liked, likeUnlike];
};