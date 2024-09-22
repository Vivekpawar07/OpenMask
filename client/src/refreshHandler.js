import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      console.log('Token from localStorage:', token); 
      console.log('Current location:', location.pathname);

      if (
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/signup'
      ) {
        console.log('Auth fail for ',location.pathname);
        navigate('/home', { replace: true });
      }
    }
  }, [navigate, location, setIsAuthenticated]);

  return null;
}