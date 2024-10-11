// src/components/profileComp/EditProfileModal.js

import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const EditProfileModal = ({ open, onClose, userProfile }) => {
    const [formData, setFormData] = useState({
        fullName: userProfile.fullName || '',
        bio: userProfile.bio || '',
        profilePic: userProfile.profilePic || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your logic to update the user profile
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/${userProfile._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Optionally refresh the user data or close the modal
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="modal-content w-full h-full flex justify-center items-center  ">
                <div className="relative w-[80%] max-w-md p-5 rounded-lg bg-custom_grey">
                    <IconButton
                        onClick={onClose}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon style={{ color: 'white' }} />
                    </IconButton>
                    <h2 className="text-white">Edit Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: { color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                        />
                        <TextField
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: { color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                        />
                        <TextField
                            label="Profile Picture URL"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                style: { color: 'white' },
                            }}
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditProfileModal;