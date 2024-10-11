import { useState } from 'react';

export const useHandleComment = (post, user) => {
    const [comment, setComment] = useState("");

    const handleComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/comment/${post._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    _id: user._id,
                    text: comment
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error:', data.message);
                return;
            }
            console.log('Comment submitted successfully:', data);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return [comment, setComment, handleComment];
};