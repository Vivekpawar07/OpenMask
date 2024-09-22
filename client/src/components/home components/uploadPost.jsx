import {React,useState,useEffect} from "react";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
export default function Upload(){
    const [profilePic,setprofilePic] = useState('');
    useEffect(()=>{
        setprofilePic(localStorage.getItem('profilePicture'));
    },[])
    return(
        <>
        <div className=" p-2 flex flex-col items-end gap-3 w-full h-[110px] bg-custom_grey rounded-2xl">
            <div className="flex gap-2 w-full">
                <img src={`${process.env.REACT_APP_BACKEND_SERVER_URL}/profile_picture/${profilePic}`} alt="profile picture" 
                className="rounded-full h-[45px] w-[45px]"/>
            <div 
            className="flex items-center  border-[1px] border-custom_grey  w-full
             gap-2 justify-start rounded-2xl p-1 shadow-inner
              shadow-white" style={{   
                 boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
              }}>
                
                <input type="text" placeholder="what's on your mind..?" 
                className="bg-transparent h-[30px] w-[100%] border-none outline-none text-white "  />
            </div>
            </div>
            <Button variant="contained"
            sx={{ float:'left', width: '80px', borderRadius: '20px', bgcolor: '#3a6f98' }}
            endIcon={<SendIcon/>}>
            Post </Button>
        </div>
        </>
    )
}