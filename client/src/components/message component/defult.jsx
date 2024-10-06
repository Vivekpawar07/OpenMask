import React from 'react';
import Pic from '../../images/ImageAI-1024x1024.gif';
export default function DefaultChatPage() {
    return (
        <div className="h-[85vh] w-[60%] bg-custom_grey rounded-2xl flex flex-col justify-center items-center p-3 gap-3">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">OpenMask</h1>
                <p className="text-lg text-center opacity-80">Select a conversation to start chatting</p>
                <div className="mt-8 flex flex-col items-center gap-2">
                    {/* Animated icon */}
                    <img src={Pic} alt="" className='h-32 rounded-full border-custom_blue border-4'/>
                    <p className="text-sm opacity-70">Waiting for you to select a chat...</p>
                </div>
            </div>
        </div>
    );
}