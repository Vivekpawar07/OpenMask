import { useState } from 'react';

const useUpdateLocation = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const updateUsersLocation = async ({ location, userID }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/location`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    userId: userID,
                    location,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update location');
            }

            const data = await response.json();
            return data; 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { updateUsersLocation, error, loading };
};

export default useUpdateLocation;