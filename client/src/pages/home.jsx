import React from 'react';
import Upload from '../components/home components/uploadPost';
import Feed from '../components/home components/feed';
import Event from '../components/home components/events';
export default function HomePage(){
    return(
        <>
        <div className='flex gap-6 w-[70%] mt-[80px] ml-[17%] mr-[15%]'>
        <div className='flex flex-col gap-3 h-[100vh] w-[60%]'>
            <Upload/>
            <Feed/>
        </div>
        <div className='flex flex-col gap-3 h-screen w-[30%]'>
            <Event/>
        </div>
        </div>
        </>
    )
}