import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import Poster from '../../images/postBanner.jpeg';
import Send from "@mui/icons-material/Send";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatePost({ closePopup }) {
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

  const { user } = useContext(AuthContext); // Get the current user from context
  const postRef = useRef(null);

  const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image URL for preview
  const [imageFile, setImageFile] = useState(null); // Store actual uploaded image file
  const [caption, setCaption] = useState(""); // Store caption text
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable button during submission

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (postRef.current && !postRef.current.contains(event.target)) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopup]);
  const type = 'image';
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl); 
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage && !caption) {
      return toast.error("Please add a caption or upload an image.");
    }

    const formData = new FormData();
    formData.append("_id", user._id); 
    formData.append("caption", caption);
    formData.append('type',type);
    if (imageFile) { 
      formData.append("profilePicture", imageFile); 
    }

    try {
      setIsSubmitting(true); 
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${localStorage.token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Post created successfully");
        console.log(result); 
        setTimeout(closePopup, 2000);
      } else {
        toast.error(result.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating the post.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="mt-36 w-[50vw] h-[100vh] inset-0 flex items-center justify-center z-100">
      <div
        ref={postRef}
        className="flex flex-col items-center gap-3 justify-center bg-custom_grey p-6 rounded-lg shadow-lg w-[70%] relative"
      >
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 hover:text-custom_blue"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold">Create a New Post</h2>

        {/* Display the uploaded image or default Poster */}
        <img
          src={uploadedImage || Poster}
          alt="Uploaded"
          className="w-96 h-80 rounded-2xl"
        />

        {/* Upload button */}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleImageUpload}
            multiple
          />
        </Button>

        {/* Conditionally render the caption input field */}
        {uploadedImage && (
          <>
            <TextField
              label="Caption"
              variant="outlined"
              fullWidth
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Button
              endIcon={<Send />}
              onClick={handleSubmit}
              disabled={isSubmitting} 
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </>
        )}
      </div>
      <ToastContainer className="z-50" // Adjust this value as needed
  style={{ zIndex: 1000,position:"fixed" }} // Or set a specific zIndex value
  autoClose={2000}  /> {/* Toast notifications */}
    </div>
  );
}