import React, { useRef,useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import Comments from "../home components/feed/commentStructure";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Button } from "@mui/material";
import Send from "@mui/icons-material/Send";
import { useLikeUnlike } from '../../hooks/LikeUnlike';
import { useHandleComment } from '../../hooks/commentHook';
export default function ProfilePost({ post, closeModal,currentProfile }) {
    const modalRef = useRef(null);
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal(); 
        }
    };
      
    const [liked, likeUnlike] = useLikeUnlike(post, currentProfile);
    const [comment, setComment, handleComment] = useHandleComment(post, currentProfile);
    return (
        <>
            <div
                className="flex fixed justify-center h-[100vh] w-[100vh] bg-transparent"
                onClick={handleClickOutside}
            >
                <div
                    ref={modalRef} 
                    className="flex w-[800px] h-[80vh] bg-custom_black rounded-2xl"
                >
                    {/* Left container for the image */}
                    <div className="w-[50%] flex flex-1">
                        <img
                            src={post.img}
                            alt="Post"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="divider-horizontal divider-info"></div>

                    {/* Right container for caption, likes, and comments */}
                    <div className="flex flex-col w-[50%] flex-1 p-4">
                        <div className="flex gap-3">
                            <img src={post.user.profilePic} alt="" className="rounded-full h-[45px] w-[45px]" />
                            <div className="flex flex-col">
                                <p>{post.user.username}</p>
                                <p className="text-[8px]">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                            </div>
                        </div>
                        <hr className="text-custom_grey border-custom_grey mt-[2%]"/>
                        <div>
                            <div className="text-sm mt-1">{post.text}</div>
                            <hr className="text-custom_grey border-custom_grey mt-[2%]"/>
                            <div className="flex flex-col overflow-scroll gap-3 h-[300px] p-1">
                                {post.comments.map((comment, index) => (
                                    <Comments key={index} comments={comment} /> // Pass each comment to the Comments component
                                ))}
                            </div>
                        </div>
                        <hr className="text-custom_grey border-custom_grey mt-[2%]"/>
                        <div className="flex flex-col">
                            <div className="flex">
                            <div className="flex flex-col justify-center items-center">
                            <div className="flex gap-1 flex-col" onClick={likeUnlike} style={{ cursor: 'pointer' }}>
                                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </div>
                            <div>{post.likes.length}</div>
                            </div>
                            <div>
                                <ChatBubbleOutlineIcon />
                            </div>
                            </div>
                            <div
                                    className="flex items-center border-[1px] border-custom_grey w-full gap-2 justify-start rounded-2xl p-1 shadow-inner shadow-white"
                                    style={{
                                        boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
                                    }}>
                                    <input type="text" placeholder="comment"
                                        className="bg-transparent h-[30px] w-full border-none outline-none text-white"
                                        onChange={(e) => { setComment(e.target.value) }} />
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
                        <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click event from bubbling up
                            console.log("Close button clicked"); // Check if this is printed in the console
                            closeModal(); // Call the closeModal function

                        }}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                        Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}