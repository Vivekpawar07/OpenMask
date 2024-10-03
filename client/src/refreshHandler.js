import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      if (
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/signup'
      ) {
        navigate('/home', { replace: true });
      }
    }
  }, [navigate, location, setIsAuthenticated]);

  return null;
}