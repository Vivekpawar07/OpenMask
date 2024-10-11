import React, { useContext, useEffect, useState, useRef } from "react";
import Divider from '@mui/material/Divider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { ChatContext } from "../../context/Chat";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";
import DisplayChat from "./showChat";
import { Link } from "react-router-dom";

export default function Chat() {
    const { selectedChat } = useContext(ChatContext);
    const [allChat, setAllChat] = useState([]);
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('');
    
    // Create a reference to the last message div
    const lastMessageRef = useRef(null);

    useEffect(() => {
        const socketInstance = io(process.env.REACT_APP_BACKEND_SERVER_URL, {
            query: { userId: user._id }, 
            transports: ['websocket'],
        });

        setSocket(socketInstance);
        socketInstance.on("newMessage", (message) => {
            setAllChat((prev) => [...prev, message]);
        });

        return () => {
            socketInstance.disconnect(); 
        };
    }, [user._id]);

    useEffect(() => {
        const getAllChat = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/chat/${selectedChat._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ _id: user._id })
            });
            if (response.ok) {
                const data = await response.json();
                setAllChat(data);
            } else {
                console.log('Failed to fetch data');
            }
        };
        getAllChat();
    }, [selectedChat._id, user._id]);

    // Scroll to the last message when allChat updates
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allChat]);

    const SendMsg = async () => {
        const messageData = {
            _id: user._id,
            message: msg
        };

        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/chat/send/${selectedChat._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify(messageData)
        });

        if (response.ok) {
            const data = await response.json();
            socket.emit("sendMessage", { ...messageData, receiverId: selectedChat._id });
            setAllChat((prev) => [...prev, data]); 
            setMsg(''); 
        } else {
            console.log('Failed to send message');
        }
    };

    return (
        <>
            <div className="h-[85vh] w-[60%] bg-custom_grey rounded-2xl flex flex-col p-3 gap-3">
                {/* this is the header */}
                <div className="flex gap-2">
                    <Link to={`/profile/${selectedChat.username}`} state ={{userProfile:selectedChat}}>
                    <img src={selectedChat.profilePic} alt="" className="rounded-full h-12 w-12" />
                    <div className="">
                        <p className="text-xs font-semibold">{selectedChat.username}</p>
                        <p className="text-xs "> full name</p>
                    </div>
                    </Link>
                </div>
                <Divider sx={{ borderColor: 'white' }} />
                {/* this is chat component */}
                <div className="h-[82%] flex flex-col overflow-scroll hide-scrollbar">
                    {allChat.map((text, index) => (
                        <DisplayChat key={index} text={text} />
                    ))}
                    <div ref={lastMessageRef} />
                </div>
                {/* text input */}
                <div className="flex items-center border-[1px] border-custom_grey  
                    gap-2 justify-start rounded-2xl p-1 shadow-inner px-1
                    shadow-white" style={{
                        boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
                    }}>
                    <InsertPhotoIcon />
                    <input type="text" placeholder="text" className="bg-transparent h-[30px] w-full border-none outline-none text-white" 
                        value={msg} 
                        onChange={(e) => setMsg(e.target.value)} 
                    />
                    <button type="button" className="text-white bg-custom_blue font-xs rounded-full text-sm px-5 py-2.5 text-center dark:bg-custom_blue" onClick={SendMsg}>send</button>
                    <button type="button" className="text-white bg-custom_blue font-xs rounded-full text-sm px-5 py-2.5 text-center dark:bg-custom_blue">enhance</button>
                    <button type="button" className="text-white bg-custom_blue font-xs rounded-full text-sm px-5 py-2.5 text-center dark:bg-custom_blue">style</button>
                </div>
            </div>
        </>
    );
}