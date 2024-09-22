import {React, useState,useEffect,useRef} from "react";
import LongMenu from "../../../mui/more";
import Post from "../../../images/images.jpeg";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
export default function Structure(){
    const [username,setUsername] = useState('');
    const [fullName,setFullName] = useState('');
    const [profilePic,setprofilePic] = useState('');
    useEffect(()=>{
        setUsername(localStorage.getItem('username'));
        setFullName(localStorage.getItem('fullName'));
        setprofilePic(localStorage.getItem('profilePicture'));
    },[])
    const [liked, setLiked] = useState(false);
      
    const handleLikeClick = () => {
          setLiked(!liked); 
    };
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    // Effect to handle click outside of popup
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (popupRef.current && !popupRef.current.contains(event.target)) {
            closePopup();
          }
        };
    
        if (isPopupOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => document.removeEventListener('mousedown', handleClickOutside);
      },[isPopupOpen])
    
    return(
        <>
        <div className=" flex p-4 flex-col gap-3  bg-custom_grey w-full rounded-xl">
            {/* header part for profile pic username and time and options */}
            <div className="flex w-full justify-between"> 
                <div className="flex felx-wrap gap-3">
                    <img src={`${process.env.REACT_APP_BACKEND_SERVER_URL}/profile_picture/${profilePic}`} alt="profile picture" 
                    className="rounded-full h-[45px] w-[45px]"/>
                    <div>
                    <p className="text-sm font-bold">{username}</p>
                    <p className="text-xs">a minutes ago</p>
                </div>
            </div>
                <LongMenu/>
            </div>
            <div>
                <p className="text-xm"> Winter is coming..🥶</p>
            </div>
            <div className="max-h-[300px] overflow-hidden">
                <img src={Post} alt="" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex gap-3">
                <div className="flex gap-1 flex-col" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </div>
                <ChatBubbleOutlineIcon onClick={openPopup}/>
            </div>
            <div>
                <p>69 likes</p>
            </div>
            {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative"
          >
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold">This is a popup!</h2>
            <p className="mt-2">You can place your content here.</p>
          </div>
        </div>
      )}
        </div>
        </>
    )
}