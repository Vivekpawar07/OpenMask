import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/Chat';

export default function DisplayChat({ text }) {
  const { user } = useContext(AuthContext);
  const { selectedChat } = useContext(ChatContext);

  return (
    <>
      {/* If the sender is the selected chat */}
      {text.senderId === selectedChat._id && (
        <div className={'chat chat-start'}>
          <div className="chat-image avatar">
            <div className="w-6 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src={selectedChat.profilePic}
              />
            </div>
          </div>
          <div className="chat-bubble">{text.message}</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
      )}
      
      {/* If the sender is the current user */}
      {text.senderId === user._id && (
        <div className={'chat chat-end'}>
          <div className="chat-image avatar">
            <div className="w-6 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src={user.profilePic}
              />
            </div>
          </div>
          <div className="chat-bubble">{text.message}</div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
      )}
    </>
  );
}