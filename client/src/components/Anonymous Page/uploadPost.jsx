import React, { useState } from "react";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import AnonymousProfile from '../../images/AnonymousProfile1.jpg';

export default function Upload() {
    const [text, setText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');

    const handleText = async () => {
        setIsPosting(true); 
        setError(''); 
        const formData = new FormData();
        formData.append("caption", text);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/anonymous/create`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setText(''); 
        } catch (error) {
            console.error('Error:', error);
            setError(error.message); // Set error message based on the response

            // Automatically clear the error message after 5 seconds
            setTimeout(() => {
                setError('');
            }, 5000);
        } finally {
            setIsPosting(false); 
        }
    };

    return (
        <>
            <div className="p-2 flex flex-col items-end gap-3 w-full h-[110px] bg-custom_grey rounded-2xl relative">
                <div className="flex gap-2 w-full">
                    {/* Anonymous post */}
                    <img
                        src={AnonymousProfile}
                        alt="profile picture"
                        className="rounded-full h-[45px] w-[45px] contained"
                    />
                    <div
                        className="flex items-center border-[1px] border-custom_grey w-full gap-2 justify-start rounded-2xl p-1 shadow-inner shadow-white"
                        style={{
                            boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="what's on your mind..?(post Anonymously)"
                            className="bg-transparent h-[30px] w-[100%] border-none outline-none text-white"
                            onChange={(e) => { setText(e.target.value); }}
                            value={text}
                        />
                    </div>
                </div>
                <Button
                    variant="contained"
                    sx={{ float: 'left', width: '80px', borderRadius: '20px', bgcolor: '#3a6f98' }}
                    endIcon={<SendIcon />}
                    onClick={handleText}
                    disabled={isPosting} 
                >
                    {isPosting ? 'Posting...' : 'Post'} 
                </Button>
                {error && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 p-4 bg-red-500 text-white rounded-lg shadow-lg">
                        {error} {/* Show error message */}
                    </div>
                )}
            </div>
        </>
    );
}