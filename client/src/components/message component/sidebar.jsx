import React,{useContext,useEffect,useState} from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import UserToChat from "./msgComp";
import { AuthContext } from "../../context/AuthContext";
import useDebouncedSearch from "../../hooks/searchHook";
import Show from "../main component/showUser";
export default function Sidebar(){
    const { user } = useContext(AuthContext);
    const [previousChats,setPreviousChats] = useState([]);
    const [suggestedChat,setSuggestedChat] = useState([]);
    const { search, setSearch, results, isLoading } = useDebouncedSearch('', 300); 
    useEffect(()=>{
        const getPreviousUser = async()=>{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/chat/${user._id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            if(!response.ok){
                throw new Error('Failed to fetch previous chats');
            }else{
            const data = await response.json()
            setPreviousChats(data);
            }
        }
        const getSuggestedChat = async()=>{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/suggestChat/${user._id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            })
            const data = await response.json()
            
        }
        getPreviousUser();
        // getSuggestedChat();
    },[])
    const clearSearch = () => {
        setSearch('');
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };
    return(
        <>
        <div className=" flex flex-col gap-3 h-[85vh] w-[30%] p-2 bg-custom_grey rounded-2xl overflow-scroll">
            {/* search bar */}
            <div 
            className="flex items-center  border-[1px] border-custom_grey  
             gap-2 justify-start rounded-2xl p-1 shadow-inner
              shadow-white" style={{   
                 boxShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 6px 0px inset, rgba(50, 50, 50, 0.5) 0px -3px 6px 1px inset'
              }}>
                <SearchRoundedIcon className="text-white"/>
                <input type="text" placeholder="Search..." 
                className="bg-transparent h-[30px] w-full border-none outline-none text-white " 
                onChange={handleSearch}
                value={search} />
            </div>
            {isLoading ? (
                <div>Loading...</div> 
            ) : (
                results.length > 0 && (
                    <div className="z-1000 fixed flex flex-col  mt-[44px] w-[280px] rounded h-[200px] items-center bg-custom_black p-2 overflow-scroll hide-scrollbar gap-2">
                        {results.map((user, index) => (
                            <UserToChat key={index} chat={{ user }} onUserSelect={clearSearch} />
                        ))}
                    </div>
                )
            )}
            <div>
                <p className="ml-2 text-xs font-semibold">Messages</p>
            </div>
            <div className="flex flex-col gap-3">
               {previousChats.map((chat,index)=>(
                   <UserToChat key={index} chat={chat}/>
               ))}
            </div>
            <div>
                suggested user
            </div>
            <div className="ml-2 text-xs font-semibold">
            {previousChats.map((chat,index)=>(
                   <UserToChat key={index} chat={chat}/>
               ))}
            </div>
        </div>
        </>
    )
}