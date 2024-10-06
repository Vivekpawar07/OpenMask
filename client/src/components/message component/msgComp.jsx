import React, {useContext} from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChatContext } from '../../context/Chat';
export default function UserToChat({ chat ,onUserSelect}) {
    const {setSelectedChat} = useContext(ChatContext);
    const handleUserToChat = ()=>{
        setSelectedChat(chat.user);
        onUserSelect();

    }
    return (
        <div className='flex gap-5' onClick={handleUserToChat}>
            <img 
                src={`${chat.user.profilePic || chat.profilePic}`} 
                alt="profilePic" 
                className='rounded-full h-[45px] w-[45px]' 
            />
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                    <p className='text-xs font-bold'>{chat.user.username || chat.username}</p>
                    {chat.lastMessage?.createdAt && (
                        <p className='text-[8px] font-light'>
                            {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                        </p>
                    )}
                </div>
                {/* Ensure single line and ellipsis for long text */}
                {chat.lastMessage?.text &&(<p 
                    className='text-xs overflow-hidden text-ellipsis whitespace-nowrap'
                    style={{ maxWidth: '200px' }} // Adjust maxWidth as per your layout
                >
                    {chat.lastMessage.text}
                </p>)}
            </div>
        </div>
    );
}