import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FestivalIcon from '@mui/icons-material/Festival';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GestureIcon from '@mui/icons-material/Gesture';
import MenuBookIcon from '@mui/icons-material/MenuBook';
export default function EventComp() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [hasMore, setHasMore] = useState(true);  
  const lat = user.location.lat;
  const long = user.location.lng;
  const icons = {
    festivals: <FestivalIcon sx={{height:'15px'}}/>,
    concerts: <CelebrationIcon sx={{height:'15px'}}/>,
    sports: <SportsCricketIcon sx={{height:'15px'}}/>,
    'performing-arts': <GestureIcon sx={{height:'15px'}}/>,
    academic: <MenuBookIcon sx={{height:'15px'}}/>
  }
  const getEvent = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/api/events?lat=${lat}&long=${long}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data);  
      } else {
        console.log('Error fetching events');
      }
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  useEffect(() => {
    getEvent();
  },[]);

 

  return (
    <>
      <div className="flex flex-col gap-2 w-full bg-custom_black h-[700px]  rounded-2xl p-3 z-20">
        <div className="flex justify-between">
            <h1 className="text-xl font-bold">Events near you</h1>
        </div>
        <div className="flex flex-col gap-3 h-full w-full overflow-y-scroll">
            {events.length > 0 ? (
                <div className="flex flex-col gap-2">
                {events.map((data, key) => (
                    <div key={key} className="flex flex-col gap-2 bg-custom_grey p-2 rounded-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1" >
                            <p className="text-xm font-semibold">{data.title}</p>
                            <div className="flex gap-2 items-center ">
                                <div className="flex items-center">
                                    <p>{icons[data.category]}</p>
                                    <p className="text-[10px]">{data.category}</p>
                                </div>
                                <p className="text-[10px] text-center">{data.end.split('T')[0]}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                    <p className="text-sm">
                    {data.description.includes("Sourced from predicthq.com - ")
                    ? data.description.replace("Sourced from predicthq.com - ", "")
                    : data.description}
  </p>
                    </div>
                    <div className=" flex items-center">
                        <LocationOnIcon sx={{height:'15px'}} />
                        <p className="text-[10px]">{data.venue.formatted_address}</p>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                hasMore && <p>Loading more events...</p>
            )}
            </div>
        
      </div>
    </>
  );
}