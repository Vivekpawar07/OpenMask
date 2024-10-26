import { useState } from 'react';

export const useGEC = () => {
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGEC = async (text) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/transforme/gec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    text: text
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMsg(data.GEC);
            } else {
                console.error('Failed to enhance text:', response.statusText);
            }
        } catch (error) {
            setError(error);
            console.error('Error enhancing text:', error);
        } finally {
            setLoading(false);
        }
    };

    return { msg, setMsg, handleGEC, loading, error };
};

export const useStyleTransfer = ()=>{
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleStyleChange = async(text,style)=>{
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/transforme/style_transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    text: text,
                    style:style
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMsg(data.style_transfer)
            } else {
                console.error('Failed to enhance text:', response.statusText);
            }
        } catch (error) {
            setError(error);
            console.error('Error enhancing text:', error);
        } finally {
            setLoading(false);
        }
    }
    return { msg, setMsg, handleStyleChange, loading, error };
};