import React, { useContext } from "react";
import Sidebar from "../components/message component/sidebar";
import Chat from "../components/message component/mainChat";
import DefaultChatPage from "../components/message component/defult";
import { ChatContext } from "../context/Chat";

export default function Messages() {
  const { selectedChat } = useContext(ChatContext);

  return (
    <>
      <div className="flex gap-6 w-[70%] mt-[80px] ml-[17%] mr-[15%]">
        <Sidebar />
        {selectedChat === null ? <DefaultChatPage /> : <Chat />}
      </div>
    </>
  );
}