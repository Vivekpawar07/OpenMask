import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./refreshHandler";
import HomePage from "./pages/home";
import Main from "./components/main component/componentHolder";
import Anonymous from "./pages/anonymous";
import Messages from "./pages/message";
import Notifications from "./pages/notification";
import Profile from "./pages/profile";
import NotFound from "./pages/404";
import { ChatProvider } from "./context/Chat";

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

  // Update to use a regex to check for dynamic routes
  const shouldRenderMain = 
    ["/home", "/anonymous", "/message", "/notification"].includes(location.pathname) ||
    /^\/profile\/[^/]+$/.test(location.pathname); // Match /profile/:username

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />

      {shouldRenderMain && <Main />}
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/anonymous" element={<Anonymous />} />
        <Route path="/message" element={<PrivateRoute element={<Messages />} />} />
        <Route path="/notification" element={<PrivateRoute element={<Notifications />} />} />
        <Route path="/profile/:username" element={<PrivateRoute element={<Profile />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ChatProvider>
  );
}