import React, { useContext } from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Button } from "@mui/material";
import { AuthContext } from '../../context/AuthContext';
import Show from "./showUser";
import useDebouncedSearch from '../../hooks/searchHook'; // Import the custom hook

export default function SearchBar() {
    const { user } = useContext(AuthContext);
    const { search, setSearch, results, isLoading } = useDebouncedSearch('', 300); 

    const clearSearch = () => {
        setSearch('');
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
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
                        value={search} // Keep input value controlled
                    />
                </div>
                <Button
                    variant="contained"
                    style={{ float: 'left', width: '180px', borderRadius: '20px', backgroundColor: '#3a6f98', fontSize: '12px' }}>
                    Search with image
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