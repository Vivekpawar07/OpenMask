import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Button from '@mui/material/Button';
import ProfilePost from '../components/profileComp/ProfileComp';
import { useFollowToggle } from '../hooks/followUnfollowHook';
import FollowersFollowingModal from '../components/profileComp/FollowListComp';
import EditProfileModal from '../components/profileComp/editProfileComp'; 
import LongMenu from '../mui/more';
export default function Profile() {
    const [selectedPost, setSelectedPost] = useState(null); 
    const location = useLocation();
    const { userProfile } = location.state || {};
    const { user } = useContext(AuthContext);
    const [userPosts, setUserPosts] = useState([]);
    const { isFollowing, toggleFollowStatus } = useFollowToggle(userProfile._id, user._id);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalData, setModalData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false); 
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    
    useEffect(() => {
        const getPosts = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/user/${userProfile.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserPosts(data);
            } else {
                throw new Error("Unable to fetch user posts");
            }
        };
        const getFollowesFollowing = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/search/followers/${userProfile._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setFollowers(data.followers);
                setFollowing(data.following);
            } else {
                throw new Error("Unable to fetch followers and following");
            }
        }

        if (userProfile?.username) {
            getPosts();
            getFollowesFollowing();
        }
    }, [userProfile?.username]);

    const openModal = (type) => {
        setModalTitle(type);
        setModalData(type === 'Followers' ? followers : following);
        setModalOpen(true); 
    };
    
    const closeModal = () => {
        setModalOpen(false); 
    };

    const openEditModal = () => {
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    if (!userProfile) {
        return <div>User data is not available.</div>;
    }

    return (
        <div className='flex justify-center gap-6 w-[70%] h-[100vh] mt-[80px] ml-[16%] mr-[15%]'>
            <div className="flex flex-col h-[85%] w-[80%] bg-custom_grey rounded-2xl p-5">
                <div className='flex gap-8 '>
                    <div className='rounded-full overflow-hidden'>
                        <img src={userProfile.profilePic || '/default-profile-pic.jpg'} alt={`${userProfile.username} profile`} className='contain h-32 w-32' />
                    </div>
                    <div className='flex'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-5'>
                                <h1>{userProfile.username}</h1>
                                <div>
                                {userProfile._id !== user._id ? (
                                    <div>
                                        <Button
                                            className="text-xs"
                                            onClick={toggleFollowStatus} 
                                        >
                                            {isFollowing ? 'Unfollow' : 'Follow'}
                                        </Button>
                                        <Button>Message</Button>
                                    </div>
                                ) : (
                                    <Button onClick={openEditModal}>Edit Profile</Button>
                                )}
                                </div>
                                {userProfile._id !== user._id ? (<LongMenu currentUserId={user._id} userToaction={userProfile._id}/>):null}
                            </div>
                            <div className='flex gap-2'>
                            <div className="flex gap-1 cursor-pointer" onClick={() => openModal('Followers')}>
                                <div>{userProfile?.followers?.length || 0}</div>
                                <div>Followers</div>
                            </div>
                            <div className="flex gap-1 cursor-pointer" onClick={() => openModal('Following')}>
                                <div>{userProfile?.following?.length || 0}</div>
                                <div>Following</div>
                            </div>
                            </div>
                            <p>{userProfile.fullName || 'No full name'}</p>
                            <p>{userProfile.bio || 'No bio available'}</p>
                        </div>
                    </div>
                </div>

                <div className="divider border-custom_blue">Posts</div>

                {selectedPost ? (
                    <ProfilePost post={selectedPost} closeModal={closeModal} currentProfile={userProfile} />
                ) : (
                    <div className='w-full h-full overflow-scroll'>
                        <div className='grid grid-cols-3 gap-0'>
                            {userPosts.length > 0 ? (
                                userPosts.map((post) => (
                                    <div key={post._id} className='w-80 h-80' onClick={() => setSelectedPost(post)}>
                                        <img src={post.img} alt={`${userProfile.username} post`} className='h-[200px] w-[200px] object-cover' />
                                    </div>
                                ))
                            ) : (
                                <div>No Posts Found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <FollowersFollowingModal
                open={modalOpen}
                onClose={closeModal}
                title={modalTitle}
                users={modalData}
            />

            <EditProfileModal 
                open={editModalOpen}
                onClose={closeEditModal}
                userProfile={userProfile}
            /> {/* Include the Edit Profile Modal */}
        </div>
    ); 
}