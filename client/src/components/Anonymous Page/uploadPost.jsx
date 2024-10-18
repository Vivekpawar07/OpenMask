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
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setText(''); 
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to post. Please try again.'); // Set error message
        } finally {
            setIsPosting(false); // Reset posting state
        }
    };

    return (
        <>
            <div className="p-2 flex flex-col items-end gap-3 w-full h-[110px] bg-custom_grey rounded-2xl">
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
                            placeholder="what's on your mind..?"
                            className="bg-transparent h-[30px] w-[100%] border-none outline-none text-white"
                            onChange={(e) => {setText(e.target.value);
                                console.log(e.target.value);
                            }}
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
                {error && <div className="text-red-500">{error}</div>} {/* Show error message */}
            </div>
        </>
    );
}