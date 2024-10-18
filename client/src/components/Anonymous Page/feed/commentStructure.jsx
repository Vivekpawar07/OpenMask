import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import AnonymousProfile from '../../../images/AnonymousProfile1.jpg';
export default function Comments({ comments }) {
    const formattedDate = comments.createdAt ? new Date(comments.createdAt) : null;

    // If the date is invalid, handle it gracefully
    const timeAgo = formattedDate ? formatDistanceToNow(formattedDate, { addSuffix: true }) : 'Invalid date';

    return (
        <>
            <div className='flex gap-5'>
                {/* anony pic here */}
                <img src={AnonymousProfile} alt="" className='rounded-full h-[45px] w-[45px]' />
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                        <p className='text-xs font-bold'>Anonymous User</p> {/* anony name here*/}
                        <p className='text-xs font-bold'>{timeAgo}</p>
                    </div>
                    <p className='text-xs'>{comments.text}</p>
                </div>
            </div>
        </>
    );
}