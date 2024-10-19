// useLocation.js
import { useState, useEffect } from "react";

const useLocation = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [errorMessageLoc, setErrorMessageLoc] = useState(null);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        setErrorMessageLoc(error.message);
                    }
                );
            } else {
                setErrorMessageLoc("Geolocation is not supported by this browser.");
            }
        };
        getLocation();
    }, []);

    return { location, errorMessageLoc };
};

export default useLocation;