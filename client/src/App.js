import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./refreshHandler";
import HomePage from "./pages/home";
import Main from "./components/componentHolder";
import Anonymous from "./pages/anonymous";



function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to='/login' replace={true} />;
  };
  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}>
      <LoginPage />
    </GoogleOAuthProvider>
  );

  const shouldRenderMain = !['/login', '/signup'].includes(location.pathname);

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

      {shouldRenderMain && <Main />}
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<HomePage />} />} />
        <Route path="/anonymous" element={ <Anonymous/>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}