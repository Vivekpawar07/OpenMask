import { createContext, useState } from 'react';

// Create the context
export const ChatContext = createContext();

// Provide the context to child components
export const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <ChatContext.Provider value={{ selectedChat, setSelectedChat }}>
            {children}
        </ChatContext.Provider>
    );
};