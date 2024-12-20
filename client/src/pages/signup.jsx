import React, { useState,useContext } from "react";
import Poster from "../images/LoginPoster.png";
import { TextField, Button, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { AuthContext } from "../context/AuthContext";
import useUpdateLocation from "../hooks/location";
import useLocation from "../hooks/getLocation";
import { Link } from "react-router-dom";
import Profile from '../images/AnonymousProfile.png';
export default function Signup() {
        const [uploadedImage, setUploadedImage] = useState(null);
        const { location, errorMessageLoc } = useLocation();
        const { updateUsersLocation, error, loading } = useUpdateLocation();
        const { setUser } = useContext(AuthContext);
        const [form, setForm] = useState({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            dob: '',
        });
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
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [imageFile, setImageFile] = useState(null);
        const navigate = useNavigate();
    
        const handleClickShowPassword = () => setShowPassword((show) => !show);
        const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
        const handleMouseDownPassword = (event) => event.preventDefault();
    
        const handleSubmit = async () => {
            if (form.password !== form.confirmPassword) {
                toast.error("Passwords do not match", { position: "top-right", autoClose: 3000 });
                return;
            }
    
            const formData = new FormData();
            formData.append('username', form.username);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('fullName', form.fullName);
            formData.append('dob', form.dob);
    
            if (imageFile) {
                formData.append('profilePicture', imageFile);  // Use imageFile directly
            }
    
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/auth/signup`, {
                    method: 'POST',
                    body: formData,
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    toast.success('Signup successful!', { position: "top-right", autoClose: 3000 });
                    setTimeout(() => {
                        localStorage.setItem('token', data.token);
                        const userWithLocation = { ...data.user, location: location };
                        setUser(userWithLocation); 
                        updateUsersLocation({ location: userWithLocation.location, userID: userWithLocation._id });
                        navigate('/home'); 
                    }, 3000);
                } else {
                    throw new Error(data.message || 'Signup failed');
                }
            } catch (error) {
                toast.error(error.message, { position: "top-right", autoClose: 3000 });
            }
        };
    
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setUploadedImage(imageUrl);
                setImageFile(file);
                console.log(imageFile)
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
        <>
            <div className="h-[100vh] w-[100vw] flex flex-wrap justify-center items-center gap-5">
                <div className="">
                    <img src={Poster} alt="Poster" className="h-96 w-96" />
                </div>
                <form className="p-2 gap-3 flex flex-col">
                    <div className="flex flex-col">
                        <h1 className="font-bold text-xl">Signup</h1>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <TextField
                                label="Username"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                sx={style}
                            />
                            <TextField
                                label="Full Name"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                sx={style}
                            />
                        </div>
                        <div className="flex gap-2">
                            <TextField
                                type="email"
                                label="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                sx={style}
                            />
                            <TextField
                                type="date"
                                label="Date of Birth"
                                value={form.dob}
                                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                sx={style}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <FormControl sx={style} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                                />
                            </FormControl>
                            <FormControl sx={style} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
                                />
                            </FormControl>
                        </div>
                        <div className="flex flex-col items-center gap-3 mt-4 mb-5">
                            <img src={uploadedImage || Profile} alt="" className='contain h-32 w-32 rounded-full' />
                            <Button 
                            variant="contained" component="label" startIcon={<CloudUploadIcon/>}
                                role={undefined}
                                tabIndex={-1}>
                                upload Profile
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleImageUpload}
                                    multiple
                                />
                            </Button>
                        </div>
                        <Button
                            sx={{ height: '35px', borderRadius: '25px', bgcolor: '#3a6f98', color: 'white' }}
                            onClick={handleSubmit}
                        >
                            Signup
                        </Button>
                        <div className="flex gap-1 items-center ">
                            <p className="text-[10px]">already have a account..?</p>
                            <Link to='/login' className="text-[10px]"><span className="text-custom_blue text-[10px]">Login</span></Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
}