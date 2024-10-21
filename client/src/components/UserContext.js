import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


const UserContext = createContext()

export const UserProvider = ({children}) =>{
    const [currentUser, setCurrentUser] = useState({})

    const fetchUser = async () =>{
        const id = localStorage.getItem('userId')
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get(`/users/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            console.log(response.data);
            setCurrentUser(response.data)

            
        } catch (error) {
            console.error('error fetching current user', error);
            
        }
    }
    useEffect(() =>{
        const id = localStorage.getItem('userId')
        console.log('User ID from localStorage:', id);
        if (id){
            fetchUser()
        }
            
    }, [])

    return (
        <UserContext.Provider  value={{ currentUser, setCurrentUser, fetchUser}}>
            {children}
        </UserContext.Provider>
    )
}
export const  useUser = () => {
    return useContext(UserContext)
}