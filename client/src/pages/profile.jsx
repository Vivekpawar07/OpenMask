import React, { useContext,useState,useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Button from '@mui/material/Button';
export default function Profile(){
    const location = useLocation();
    const { userProfile } = location.state || {}; // Extract user data from the state
    const {user} = useContext(AuthContext)
    const [userPosts,setUserPost] = useState([])
    console.log(userProfile)
    useEffect(() => {
        const getPosts = async()=>{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/user/${userProfile.username}`,{
                method: 'GET',
                headers:{'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            console.log(data)
            if(response.ok){
                setUserPost(data);
            }
            else{
                throw new Error("unable to fetch user post")
                console.error('Error:', data.message);
                // Handle the error (e.g., show error message)
                // setUserPosts([]); // Reset the posts array to an empty array in case of error.
            }
            
        }
        getPosts();
        
    },[])

    if (!userProfile) {
        return <div>User data is not available.</div>;
    }

    // Render the user profile data here...
    return(
        <>
        <div className='flex justify-center gap-6 w-[70%] h-[100vh] mt-[80px] ml-[16%] mr-[15%]'>
            <div className="flex flex-col h-[85%] w-[80%] bg-custom_grey rounded-2xl p-5">
                {/* div to display Profile of the user */}
                <div className='flex gap-8 '>
                    <div className=' rounded-full overflow-hidden'>
                        <img src={userProfile.profilePic} alt={`${userProfile.username} profile`} className='contain h-32 w-32'/>
                    </div>
                    <div className='flex'>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h1>{userProfile.username}</h1>
                            <p>{userProfile.name || 'full name'}</p>
                        </div>
                        <p>{userProfile.bio || 'bio'}</p>
                    </div>
                        <div className='flex'>
                            <div className="stat">
                                <div className="stat-value">{userProfile.followers.length}</div>
                                <div className="stat-title ">Followers</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{userProfile.following.length}</div>
                                <div className="stat-title">following</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <Button>Follow</Button>
                        <Button>Message</Button>
                    </div>
                </div>

                <div className="divider  border-custom_blue">Post</div>
                {/* post section */}
                <div className='w-full h-full overflow-scroll '>
                    <div className='flex'>
                    { userPosts.length > 0 && (userPosts.map((post) => (
                            <div className='w-80 h-80'>
                                <img src={post.img} alt={`${userProfile.username} profile pic`} className=''/>
                            </div>
                    )))}
                    {
                        userPosts.length === 0 && <div>No Posts Found</div>  // Display a message when there are no posts.  // Add loading spinner or error handling here.  // userPosts.length === 0 && <LoadingSpinner />  // userPosts.length === 0 && <ErrorMessage message="Unable to fetch user posts" />  // userPosts.length === 0 && <div>User has no posts yet</div>  // userPosts.length === 0 && <div>User has no posts yet</div>  // userPosts.length === 0 && <div>User has no posts yet</div>  // userPosts.length === 0 && <div>User has no posts yet</div>  // userPosts.length === 0 && <div>User has no posts yet</div>  // userPosts.length === 0 && <div>User has no posts yet</div>
                    }
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
}