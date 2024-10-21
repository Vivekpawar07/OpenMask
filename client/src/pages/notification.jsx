import React,{useState,useEffect,useContext} from "react";
import {AuthContext} from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
export default function Notifications(){
    const {user} = useContext(AuthContext);
    const [notifications,setNotifications] = useState([]);
    useEffect(() => {
        const handleNotifications = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/notifications/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
    
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
    
        if (user && user._id) {
            handleNotifications();
        }
    }, []); 
    const messageType = {
        like: 'liked your post',
        comment: 'commented on your post',
        follow: 'started following you',
        report: 'reported you',
        blocked: 'blocked you',
        post: 'your created a post have a look'
    }
    return(
        <>
        <div className="flex flex-col  w-[70%] mt-[80px] ml-[20%] mr-[15%]">
            <div className="flex flex-col p-5 gap-3 w-[86%] h-[85vh] bg-custom_black rounded-2xl overflow-scroll">
            {notifications.length === 0 ? (
                <p>No notifications available</p>
            ) : (
                notifications.map((notify) => (
                    <div key={notify._id} className="flex w-full bg-custom_grey p-3 rounded-2xl gap-2">
                        <img src={notify.from.profilePic} alt={`${notify.from.username}'s profile`} 
                        className="h-12 w-12 rounded-full"/>
                        <div className="flex flex-col">
                            <div className="flex gap-2">
                                <h1>{notify.from.username}</h1>
                                <p>{formatDistanceToNow(new Date(notify.createdAt), { addSuffix: true })}</p> 
                            </div>
                            <p>{messageType[notify.type] || 'message as per type'}</p>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
        </>
    )
}