import React, { useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChatContext } from '../../context/Chat';

export default function UserToChat({ chat, onUserSelect = () => {} }) {
    const { setSelectedChat } = useContext(ChatContext);

    const handleUserToChat = () => {
        setSelectedChat(chat.user || chat); 
        onUserSelect();
    };

    const profilePic = chat?.user?.profilePic || chat?.profilePic;
    const username = chat?.user?.username || chat?.username;
    const lastMessageText = chat?.lastMessage?.text || '';
    const lastMessageTime = chat?.lastMessage?.createdAt;

    return (
        <div className='flex gap-5' onClick={handleUserToChat}>
            <img
                src={profilePic || '/default-profile-pic.jpg'} 
                alt="profilePic"
                className='rounded-full h-[45px] w-[45px]'
            />
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                    <p className='text-xs font-bold'>{username}</p>
                    {lastMessageTime && (
                        <p className='text-[8px] font-light'>
                            {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: true })}
                        </p>
                    )}
                </div>
                {/* Ensure single line and ellipsis for long text */}
                {lastMessageText && (
                    <p
                        className='text-xs overflow-hidden text-ellipsis whitespace-nowrap'
                        style={{ maxWidth: '200px' }} // Adjust maxWidth as per your layout
                    >
                        {lastMessageText}
                    </p>
                )}
            </div>
        </div>
    );
}