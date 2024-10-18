import React, { useEffect, useState } from 'react';
import Structure from './feed/feedStructure';

export default function Feed() {
    const [allPosts, setAllPosts] = useState([]);
    const [loadingAllPosts, setLoadingAllPosts] = useState(true);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoadingAllPosts(true);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/anonymous/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch all posts');
                }

                const data = await response.json();
                setAllPosts(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error fetching all posts:', error);
                setAllPosts([]);
            } finally {
                setLoadingAllPosts(false);
            }
        };
        fetchAllPosts();
    },[]);

    return (
        <div className="flex flex-col gap-3 justify-center">
            {/* All posts */}
            {loadingAllPosts ? (
                <p>Loading all posts...</p>
            ) : allPosts.length > 0 ? (
                allPosts.map((post, index) => (
                    <Structure key={index} post={post} /> // Using post here too
                ))
            ) : (
                <p>No more posts available</p>
            )}
        </div>
    );
}