import react from 'react';
import Test from '../../../images/poster 2.jpeg';
export default function Comments({comments}){
    return(
        <>
        <div className='flex gap-5'>
            <img src={Test} alt="" className='rounded-full h-[45px] w-[45px]' />
            <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                    <p className='text-xs font-bold'> username</p>
                    <p className='text-xs font-bold'>time</p>
                </div>
                <p className='text-xs'>comment</p>
            </div>
        </div>
        </>
    )
}