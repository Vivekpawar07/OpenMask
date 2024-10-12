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
const EditProfileModal = ({ open, onClose, userProfile }) => {
    const { setUser } = useContext(AuthContext);
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

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
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
                            <img src={formData.profilePicture} alt="" className='contain h-32 w-32 rounded-full' />
                            <Button variant="contained" component="label">
                                Change Profile Picture
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
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