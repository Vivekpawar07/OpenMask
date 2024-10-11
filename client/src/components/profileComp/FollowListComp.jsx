import React from 'react';
import { Modal, Box} from '@mui/material';

function FollowersFollowingModal({ open, onClose, title, users }) {
    console.log(users);
    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modal-content" sx={{}}>
                <div variant="h6">{title}</div>
                <div className="flex gap-2 items-center">
                    <div>{users}</div>
                        <img src={users.profilePic} alt="profile pic" className="h-12 w-12 rounded-full" />
                        <div>
                            <p className="text-xs font-bold">{users.username}</p>
                            <p className="text-xs">{users.fullName}</p>
                        </div>
                    </div>
            </Box>
        </Modal>
    );
}

export default FollowersFollowingModal;