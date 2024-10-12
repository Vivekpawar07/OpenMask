import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Report = async({currentUserId, userToReport, reason}) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/report`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                userId: currentUserId,
                reportedUserId:userToReport,
                reason
            })
        });

        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error(`Error: ${response.status} - ${response.statusText}`, errorResponse);
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error while reporting user:', error);
        throw error;
    }
}
export const BlockUser = async({userId,blockedUserId})=>{
    const {setUser} = useContext(AuthContext)
    const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/user/block`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            userId,
            blockedUserId
        })
    })
    const data = await response.json();
    if (!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    console.log(data)
    setUser(data)
}