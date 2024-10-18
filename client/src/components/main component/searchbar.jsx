import React, { useContext, useState } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Button } from "@mui/material";
import { AuthContext } from '../../context/AuthContext';
import Show from "./showUser";
import useDebouncedSearch from '../../hooks/searchHook'; // Import the custom hook
import { styled } from '@mui/material/styles';
import ImageSearch from '../../images/imaegSearch.jpeg';
import { useNavigate } from "react-router-dom";


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
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { search, setSearch, results, isLoading } = useDebouncedSearch('', 300); 
    const [isImageSearch, setIsImageSearch] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageSearch, setImageSearch] = useState([]);
    const [isSearching, setIsSearching] = useState(false);  // Fixed typo here: `cosnt` -> `const`

    const getProfile = (user) => {
        navigate(`/profile/${user.username}`, { state: { userProfile: user } });
    };

    const handleImageSearchDiv = () => {
        setIsImageSearch(!isImageSearch);
    };

    const clearSearch = () => {
        setSearch('');
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleImageSearch = async () => {
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
                if (response.ok) {
                    setImageSearch(result);
                } else {
                    console.error('Error during image search:', response.statusText);
                }
            } catch (error) {
                console.error('Error during image search:', error);
            }
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl); 
            setImageFile(file);
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
                    onClick={handleImageSearchDiv}
                    style={{ float: 'left', width: '180px', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}
                >
                    Search with Image
                </Button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                results.length > 0 && (
                    <div className="z-100 fixed flex flex-col ml-[18%] mt-[61px] w-[360px] h-[200px] items-center bg-custom_black p-2 overflow-scroll hide-scrollbar gap-2">
                        {results.map((user, index) => (
                            <Show key={index} user={user} onUserSelect={clearSearch}/>
                        ))}
                    </div>
                )
            )}

            {/* Popup for image upload */}
            {isImageSearch && (
                <div className="fixed inset-0 flex items-center bg-custom_black bg-opacity-50 z-auto">
                    <div className="bg-custom_grey p-5 rounded shadow-md ml-[30%] flex flex-col items-center gap-3">
                        <h2 className="text-lg font-bold mb-4">Upload an Image to Search</h2>
                        <img src={uploadedImage || ImageSearch} alt="Uploaded" className="h-56 w-56 rounded-2xl" />
                        <Button
                            component="label"
                            variant="contained"
                            style={{ float: 'left', width: '180px', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}
                        >
                            Upload Image
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                multiple={false}
                            />
                        </Button>

                        {isSearching ? (
                            <div>Loading...</div>
                        ) : (
                            imageSearch.length > 0 && (
                                imageSearch.map((user, index) => (
                                    <div key={index} className="flex w-full rounded-xl bg-custom_grey p-2 gap-2" onClick={() => getProfile(user)}>
                                        <div className="rounded-full overflow-hidden">
                                            <img src={user.profilePic} alt="Profile" className="h-12 w-12" />
                                        </div>
                                        <div>
                                            <h1>{user.username}</h1>
                                            <p>{user.fullname}</p>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        <div className="flex mt-4">
                            <Button
                                variant="outlined"
                                onClick={handleImageSearch}
                                style={{ marginLeft: '10px' }}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleImageSearchDiv}
                                style={{ marginLeft: '10px' }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}