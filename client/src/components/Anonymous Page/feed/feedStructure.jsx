import React, { useRef, useContext, useEffect,useState } from "react";
import LongMenu from "../../../mui/more";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatDistanceToNow } from 'date-fns';
import { AuthContext } from "../../../context/AuthContext";
import Comments from "./commentStructure";
import Send from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useLikeUnlike } from '../../../hooks/anonymousLikeUnlike';
import { useHandleComment } from '../../../hooks/anonymousComment';
import AnonymousProfile from '../../../images/AnonymousProfile.png';
export default function Structure({ post }) {
    const { user } = useContext(AuthContext);
    const [liked, likeUnlike] = useLikeUnlike(post, user);
    const [comment, setComment, handleComment] = useHandleComment(post, user);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

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
    }, [isPopupOpen]);

    return (
        <div className="flex p-4 flex-col gap-3 bg-custom_grey w-full rounded-xl">
            <div className="flex w-full justify-between">
                
                    <div className="flex flex-wrap gap-3">
                        {/* Anony Profile here */}
                        <img src={AnonymousProfile} alt="profile picture" className="rounded-full h-[45px] w-[45px]" />
                        <div>
                            {/* Ano Name hawre */}
                            <p className="text-sm font-bold">Anonymous user</p>
                            <p className="text-xs">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                <LongMenu />
            </div>

            <div>
                <p className="text-xm">{post.text}</p>
            </div>

            <div className="flex gap-3">
                <div className="flex gap-1 flex-col" onClick={likeUnlike} style={{ cursor: 'pointer' }}>
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </div>
                <ChatBubbleOutlineIcon onClick={openPopup} />
            </div>

            <div>
                <p>{post.likes.length} likes</p>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={popupRef}
                        className="bg-custom_grey p-6 rounded-lg shadow-lg w-1/3 relative"
                    >
                        <button
                            onClick={closePopup}
                            className="absolute top-2 right-2 text-white hover:text-custom_blue"
                        >
                            &times;
                        </button>
                        <div className="flex flex-col overflow-scroll gap-3">
                            <div className="flex flex-col overflow-scroll gap-3 h-[300px]">
                                {post.comments.map((comment, index) => (
                                    <Comments key={index} comments={comment} />
                                ))}
                            </div>
                            <div className="flex">
                                <div
                                    className="flex items-center border-[1px] border-custom_grey w-full gap-2 justify-start rounded-2xl p-1 shadow-inner shadow-white"
                                    style={{
                                        boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
                                    }}>
                                    <input type="text" placeholder="comment"
                                        className="bg-transparent h-[30px] w-full border-none outline-none text-white"
                                        onChange={(e) => setComment(e.target.value)} />
                                    <Button variant="contained"
                                        style={{ float: 'left', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}
                                    >
                                        enhance
                                    </Button>
                                    <Button variant="contained"
                                        style={{ float: 'left', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}
                                    >
                                        style
                                    </Button>
                                    <Button variant="contained"
                                        style={{ float: 'left', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}
                                        endIcon={<Send />}
                                        onClick={handleComment}>
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}