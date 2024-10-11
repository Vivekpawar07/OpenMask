// hooks/useFollowData.js
import { useState, useEffect } from 'react';

export const useFollowingData = (followingIds) => {
    const [following, setFollowing] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/search/bulk`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ _ids: followingIds })
                });

                if (!response.ok) {
                    throw new Error("Unable to fetch following data");
                }

                const data = await response.json();
                setFollowing(data.users);
            } catch (err) {
                setError(err.message);
            }
        };

        if (followingIds.length > 0) {
            fetchFollowing();
        }
    }, [followingIds]);

    return { following, error };
};

export const useFollowersData = (followerIds) => {
    const [followers, setFollowers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const userIds = followerIds.join(',');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/search/${userIds}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Unable to fetch followers data");
                }

                const data = await response.json();
                setFollowers(data.users);
            } catch (err) {
                setError(err.message);
            }
        };

        if (followerIds.length > 0) {
            fetchFollowers();
        }
    }, [followerIds]);

    return { followers, error };
};