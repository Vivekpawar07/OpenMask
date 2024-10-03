import React, { useState ,useContext} from "react";
import Poster from "../images/LoginPoster.png";
import { TextField, Button, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import SendIcon from '@mui/icons-material/Send';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const { setUser } = useContext(AuthContext);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/auth/login`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Login successful!', {
                    position: "top-right",
                    autoClose: 3000,
                });

                setTimeout(() => {
                    localStorage.setItem('token', data.token);
                    setUser(data.user);  // Store the user data in the context
                    navigate('/home'); 
                    console.log(data);
                }, 3000);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error(error.message, {
                position: "top-right",
                autoClose: 3000,
            });
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
                {/* poster div */}
                <div className="hidden md:flex">
                    <img src={Poster} alt="Poster" className="h-96 w-96" />
                </div>
                {/* login form */}
                <form className="p-2 gap-3 flex flex-col">
                    <div className="flex flex-col">
                        <h1 className="font-bold text-xl">Login</h1>
                        <p className="font-medium">Stay anonymous, speak bold</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <TextField
                            type="email"
                            label="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            sx={style}
                        />
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
                        <Button
                            sx={{ height: '35px', borderRadius: '25px', bgcolor: '#3a6f98', color: 'white' }}
                            endIcon={<SendIcon />}
                            onClick={handleSubmit}
                        >
                            Login
                        </Button>
                        <div className="flex items-center gap-2">
                            <hr style={{
                                margin: '20px 0', width: '90px', borderRadius: '25px',
                                background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)'
                            }} />
                            <p>OR</p>
                            <hr style={{
                                margin: '20px 0', width: '90px', borderRadius: '25px',
                                background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)'
                            }} />
                        </div>
                        <Button
                            sx={{ height: '35px', borderRadius: '25px', bgcolor: '#3a6f98', color: 'white' }}
                            endIcon={<GoogleIcon />}
                        >
                            Google
                        </Button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
}