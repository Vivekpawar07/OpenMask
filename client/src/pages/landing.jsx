import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed for navigation

const IntroductionPage = () => {
  return (
    <div className="bg-custom_black min-h-screen flex flex-col items-center justify-center text-white">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-5xl font-bold">Connect Anonymously, Share Freely</h1>
        <p className="text-lg mt-4">Experience the best of both worlds in social media.</p>
      </header>

      {/* Buttons Section */}
      <div className="flex space-x-4">
        <Link to="/login">
          <button className="bg-custom_blue text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-custom_grey text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Optional Footer Section */}
      <footer className="mt-10">
        <p className="text-sm">&copy; 2024 Your Website Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default IntroductionPage;