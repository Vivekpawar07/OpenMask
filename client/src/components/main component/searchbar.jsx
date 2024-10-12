import React, { useContext, useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Button } from "@mui/material";
import { AuthContext } from '../../context/AuthContext';
import Show from "./showUser";
import useDebouncedSearch from '../../hooks/searchHook'; // Import the custom hook
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

export default function SearchBar() {
    const { user } = useContext(AuthContext);
    const { search, setSearch, results, isLoading } = useDebouncedSearch('', 300); 

    const clearSearch = () => {
        setSearch('');
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    
    const handleImageSearch = async() => {
        const formData = new FormData(); 
        if (imageFile) {
            formData.append("profilePicture", imageFile); 
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/imageSearch`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
                    body: formData,
                });
                const result = await response.json();
                console.log(result);
            } catch (error) {
                console.error('Error during image search:', error);
            }
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl); 
            setImageFile(file);
            console.log(imageFile)
            handleImageSearch(); 
        }
    };
    
    return (
        <>
            <div className="fixed flex items-center gap-5 bg-custom_grey text-black ml-[15%] w-[70%] h-[60px] overflow-hidden">
                <div
                    className="flex items-center ml-10 border-[1px] border-custom_grey w-[40%] gap-2 justify-start rounded-2xl p-1 shadow-inner shadow-white"
                    style={{
                        boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
                    }}>
                    <SearchRoundedIcon className="text-white" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent h-[30px] w-full border-none outline-none text-white"
                        onChange={handleSearch}
                        value={search} 
                    />
                </div>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    style={{ float: 'left', width: '180px', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}
                >
                    Search with Image
                    <VisuallyHiddenInput
                        type="file"
                        accept="image/*" 
                        onChange={handleImageUpload}
                        multiple={false}
                    />
                </Button>
            </div>

            {isLoading ? (
                <div>Loading...</div> // Show loading state
            ) : (
                results.length > 0 && (
                    <div className="z-100 fixed flex flex-col ml-[18%] mt-[61px] w-[360px] h-[200px] items-center bg-custom_black p-2 overflow-scroll hide-scrollbar gap-2">
                        {results.map((user, index) => (
                            <Show key={index} user={user} onUserSelect={clearSearch}/>
                        ))}
                    </div>
                )
            )}
        </>
    );
}