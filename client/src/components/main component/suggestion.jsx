import React, { useState, useEffect, useContext } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import { AuthContext } from '../../context/AuthContext';
import GetSuggestion from './suggestedUser';
export default function Suggestion() {
    const { user } = useContext(AuthContext); 
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/getSuggestion`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`, 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _id: user._id }) 
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                // console.log(data.suggestedUsers);

                setSuggestions(Array.isArray(data.suggestedUsers) ? data.suggestedUsers : []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]); 
            } finally {
                setLoading(false); 
            }
        };

        if (user?._id) { 
            fetchData();
        }

    }, [user?._id]); 

    return (
        <div className="fixed h-[100%] flex flex-col gap-5 justify-self-end w-[15%] bg-custom_grey p-2">
            <div className="flex h-[60px] w-full items-center justify-evenly">
                <SettingsIcon />
                <div className="flex items-center gap-2">
                    <p>{user?.username}</p>
                    <img 
                        src={`${user?.profilePic}`} 
                        alt="profile picture" 
                        className="rounded-full h-[45px] w-[45px]" 
                    />
                </div>
            </div>
            <div>
                <h1 className="text-xm font-bold">Suggestions For You</h1>
            </div>
            <div>
                {loading ? (
                    <p>Loading suggestions...</p>
                ) : suggestions.length > 0 ? (
                    suggestions.map((suggestedUser, index) => (
                        <GetSuggestion key={index} suggestedUser={suggestedUser} />
                    ))
                ) : (
                    <p>No suggestions available</p> 
                )}
            </div>
        </div>
    );
}