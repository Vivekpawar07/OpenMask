import {React,useContext,useState} from "react";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../../context/AuthContext';
export default function Upload(){
    const {user} = useContext(AuthContext);
    const [text,setText] = useState('');
    const handleText = async()=>{
        const formData = new FormData();
        formData.append("_id", user._id);
        formData.append("caption", text);
        formData.append('type',"text");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/create`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `${localStorage.token}`,
            },
          });
          const data = await response.json();
          console.log(data);
    }
    return(
        <>
        <div className=" p-2 flex flex-col items-end gap-3 w-full h-[110px] bg-custom_grey rounded-2xl">
            <div className="flex gap-2 w-full">
                <img src={`${user.profilePic}`} alt="profile picture" 
                className="rounded-full h-[45px] w-[45px]"/>
            <div 
            className="flex items-center  border-[1px] border-custom_grey  w-full
             gap-2 justify-start rounded-2xl p-1 shadow-inner
              shadow-white" style={{   
                 boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
              }}>
                
                <input type="text" placeholder="what's on your mind..?" 
                className="bg-transparent h-[30px] w-[100%] border-none outline-none text-white "
                onChange={(e)=>{setText(e.target.value)}}  />
            </div>
            </div>
            <Button variant="contained"
            sx={{ float:'left', width: '80px', borderRadius: '20px', bgcolor: '#3a6f98' }}
            endIcon={<SendIcon/>} 
            onClick={handleText}>
            Post </Button>
        </div>
        </>
    )
}