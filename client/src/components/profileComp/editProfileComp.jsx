import React, { useState,useContext } from 'react';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Button, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VerifiedIcon from '@mui/icons-material/Verified';
import MultipleSelectChip from '../../mui/Multichip'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AuthContext } from '../../context/AuthContext';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const EditProfileModal = ({ open, onClose, userProfile }) => {
    const { setUser } = useContext(AuthContext);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: userProfile.fullName || '',
        bio: userProfile.bio || '',
        profilePicture: userProfile.profilePic || '',
        username: userProfile.username || '',
        gender: userProfile.gender || '',
        email: userProfile.email || '',
        newPassword: "",
        confirmPassword: "",
        interests: userProfile.interests || "",
        isVerified: userProfile.isVerified || false,
        _id: userProfile._id
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("bio", formData.bio);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("newPassword", formData.newPassword);
        formDataToSend.append("confirmPassword", formData.confirmPassword);
        formDataToSend.append("isVerified", formData.isVerified);
        formDataToSend.append("_id", formData._id);
        
        if (imageFile) {
            formDataToSend.append("profilePicture", imageFile);
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            setUser(data);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setImageFile(file);
        }
    };


    const style = {
        backgroundColor: "#2c2c2c",
        borderRadius: '25px',
        height: '45px',
        color: 'white',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3a6f98',
        },
        '& .MuiInputLabel-root': {
            color: 'white',
        },
        '&.Mui-focused .MuiInputLabel-root': {
            color: 'white',
        },
        '& input': {
            color: 'white',
        },
        '& input::placeholder': {
            color: 'white',
            opacity: 1,
        },
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="modal-content w-full h-full flex justify-center items-center">
                <div className="relative w-[80%] max-w-md p-5 rounded-lg bg-custom_grey">
                    <IconButton
                        onClick={onClose}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon style={{ color: 'white' }} />
                    </IconButton>
                    <h2 className="text-white">Edit Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
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
                                label="Username"
                                name="username"
                                value={formData.username}
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
                                disabled
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    style: { color: 'white' },
                                    endAdornment: userProfile.isVerified && (
                                        <InputAdornment position="end">
                                            <IconButton edge="end">
                                                <VerifiedIcon style={{ color: '#4caf50' }} /> {/* Assuming VerifiedIcon for verified status */}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
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
                            <FormControl sx={style} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">old Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                    sx={style}
                                />
                            </FormControl>
                            <FormControl sx={style} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-confirm-password">New Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-confirm-password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Confirm Password"
                                    sx={style}
                                />
                            </FormControl>
                            <MultipleSelectChip/>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="gender" // add the name here to match the formData key
                                        value={formData.gender}
                                        label="Gender"
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })} // updated onChange
                                    >
                                        <MenuItem value={"male"}>Male</MenuItem>
                                        <MenuItem value={"female"}>Female</MenuItem>
                                        <MenuItem value={"others"}>Others</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>

                        <div className="flex flex-col items-center gap-3 mt-4 mb-5">
                            <img src={uploadedImage || formData.profilePicture} alt="" className='contain h-32 w-32 rounded-full' />
                            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                                Upload Profile
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        </div>
                        <Button type="submit" variant="contained" color="primary" fullWidth className="mt-6">
                            Save Changes
                        </Button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditProfileModal;