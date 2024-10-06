import React, { useEffect, useContext, useState } from 'react';
import Structure from './feed/feedStructure';
import { AuthContext } from '../../context/AuthContext';

export default function Feed() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingAllPosts, setLoadingAllPosts] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoadingPosts(true);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/following`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ _id: user._id })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch following posts');
                }

                const data = await response.json();
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            } finally {
                setLoadingPosts(false);
            }
        };

        const fetchAllPosts = async () => {
            try {
                setLoadingAllPosts(true);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/feed/all`, {
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

        if (user && user._id) {
            fetchPosts();
            fetchAllPosts();
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-3 justify-center">
            {/* Following posts */}
            {loadingPosts ? (
                <p>Loading posts...</p>
            ) : posts.length > 0 ? (
                posts.map((post, index) => (
                    <Structure key={index} post={post} /> 
                ))
            ) : (
                <p>No posts found</p>
            )}

            <p>You caught up</p>

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