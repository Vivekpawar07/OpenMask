import React, { useContext, useEffect, useState, useRef } from "react";
import Divider from '@mui/material/Divider';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { ChatContext } from "../../context/Chat";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";
import DisplayChat from "./showChat";
import { Link } from "react-router-dom";
import { useGEC, useStyleTransfer } from "../../hooks/textTransformation";
import { Menu, MenuItem, Button } from '@mui/material';

export default function Chat() {
    const { selectedChat } = useContext(ChatContext);
    const [allChat, setAllChat] = useState([]);
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState('');
    const [style, setStyle] = useState('');
    const { msg: enhancedMsg, handleGEC, isEnhancing } = useGEC();
    const { msg: styleTransferedMsg, handleStyleChange, isStyling } = useStyleTransfer();
    const [anchorEl, setAnchorEl] = useState(null);
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

    const handleEnhanceClick = async () => {
        const enhancedText = await handleGEC(msg);
        console.log(enhancedText); 
        if (enhancedText) {
            setMsg(enhancedText); 
        }
    };
    

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStyleSelect = async (selectedStyle) => {
        setStyle(selectedStyle);
        handleClose();
        const styledText = await handleStyleChange(msg, selectedStyle); 
        console.log(styledText);
        if (styledText) {
            setMsg(styledText); 
        }
    };

    return (
        <>
            <div className="h-[85vh] w-[60%] bg-custom_grey rounded-2xl flex flex-col p-3 gap-3">
                {/* Header */}
                <div className="flex gap-2">
                    <Link to={`/profile/${selectedChat.username}`} state={{ userProfile: selectedChat }}>
                        <img src={selectedChat.profilePic} alt="" className="rounded-full h-12 w-12" />
                        <div>
                            <p className="text-xs font-semibold">{selectedChat.username}</p>
                            <p className="text-xs">Full Name</p>
                        </div>
                    </Link>
                </div>
                <Divider sx={{ borderColor: 'white' }} />
                {/* Chat */}
                <div className="h-[82%] flex flex-col overflow-scroll hide-scrollbar">
                    {allChat.map((text, index) => (
                        <DisplayChat key={index} text={text} />
                    ))}
                    <div ref={lastMessageRef} />
                </div>
                {/* Input */}
                <div className="flex items-center border-[1px] border-custom_grey gap-2 rounded-2xl p-1 shadow-inner px-1">
                    <InsertPhotoIcon />
                    <input
                        type="text"
                        placeholder="text"
                        className="bg-transparent h-[30px] w-full border-none outline-none text-white"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    <button onClick={SendMsg} disabled={!msg.trim()}>
                        Send
                    </button>
                    <button onClick={handleEnhanceClick} disabled={isEnhancing}>
                        {isEnhancing ? "Enhancing..." : "Enhance"}
                    </button>
                    <Button onClick={handleClick} disabled={isStyling}>
                        {isStyling ? "Styling..." : "Style"}
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem onClick={() => handleStyleSelect('Happy')}>Happy</MenuItem>
                        <MenuItem onClick={() => handleStyleSelect('Sad')}>Sad</MenuItem>
                        <MenuItem onClick={() => handleStyleSelect('Angry')}>Angry</MenuItem>
                    </Menu>
                </div>
            </div>
        </>
    );
}