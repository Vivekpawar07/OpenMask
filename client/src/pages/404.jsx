import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './notfound.css'; 
import { useLocation } from'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  console.log(location.pathname)
  return (
    <Box className="min-h-screen flex flex-col justify-center items-center bg-custom_black text-white">
      <Typography variant="h1" className="animate-text text-6xl mb-6">
        404
      </Typography>
      <Typography variant="h5" className="animate-fade text-custom_blue mb-4">
        Page Not Found
      </Typography>
      <Typography variant="body1" className="mb-8 text-center text-custom_grey px-4">
        Sorry, the page you are looking for doesn’t exist. Please check the URL or go back to the homepage.
      </Typography>
      <Link to="/">
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'custom_blue',
            color: 'white',
            '&:hover': { backgroundColor: '#35708a' },
          }}
        >
          Go Home
        </Button>
      </Link>
      <div className="absolute bottom-10 animate-float">
        <Typography variant="caption" className="text-custom_grey">
          Animated 404 Page | Your Website
        </Typography>
      </div>
    </Box>
  );
};

export default NotFound;