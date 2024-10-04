import React from 'react';
export default function UserToChat({user}){
    return(
        <div className='flex gap-5'>
                <img src={''} alt="" className='rounded-full h-[45px] w-[45px]' />
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <p className='text-xs font-bold'>username</p>
                        <p className='text-xs font-bold'>time</p>
                    </div>
                    <p className='text-xs'>last message</p>
                </div>
            </div>
    )
}