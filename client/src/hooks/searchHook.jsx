// useDebouncedSearch.js

import { useState, useEffect } from "react";

const useDebouncedSearch = (initialSearch, delay) => {
    const [search, setSearch] = useState(initialSearch);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearchTerm = useDebounce(search, delay);

    useEffect(() => {
        const fetchData = async () => {
            if (debouncedSearchTerm) {
                setIsLoading(true); // Set loading state
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/search/${debouncedSearchTerm}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token'),
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setResults(data.users || []); // Assuming the response contains an array of users
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setIsLoading(false); // Reset loading state
                }
            } else {
                setResults([]); // Clear results if search is empty
            }
        };

        fetchData();
    }, [debouncedSearchTerm]);

    return { search, setSearch, results, isLoading };
};

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebouncedSearch;