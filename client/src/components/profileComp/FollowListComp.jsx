import React from 'react';
import { Modal, Box } from '@mui/material';
import {Link} from 'react-router-dom';
function FollowersFollowingModal({ open, onClose, title, users }) {
    return (
        <Modal open={open} onClose={onClose} sx={{height:'100vh',width:'100vw',display:'flex' , justifyContent:"center", marginTop:'15%'}}>
            <Box className="modal-content" sx={{ p: 2, borderRadius: 2, height:'200px', width:'200px',bgcolor:'#2c2c2c',overflow:'scroll',display:'flex' ,flexDirection:'column' }}>
                <div className="text-lg font-bold mb-4 sticky">{title}</div>
                <div>
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <Link to={`/profile/${user.username}`} state={{userProfile:user}}>
                            <div key={user._id} className="flex gap-2 items-center mb-2">
                                <img
                                    src={user.profilePic}
                                    alt="profile pic"
                                    className="h-12 w-12 rounded-full"
                                />
                                <div>
                                    <p className="text-xs font-bold">{user.username}</p>
                                </div>
                            </div>
                            </Link>
                        ))
                    ) : (
                        <p>No {title.toLowerCase()} found.</p>
                    )}
                </div>
            </Box>
        </Modal>
    );
}

export default FollowersFollowingModal;