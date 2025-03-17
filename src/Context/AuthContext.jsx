import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'


export const AuthContext = createContext(false);

export default function AuthContextProvider({ children }) {

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    useEffect(() => {
        async function verifyUserToken() {
            let response = await axios.get("https://ecommerce.routemisr.com/api/v1/auth/verifyToken", {
                headers: {
                    token: localStorage.getItem("token")
                }
            }).then(function (response) {
                console.log("Good");
                setIsUserLoggedIn(true)
            }).catch(function (error) {
                // console.log(error)
                setIsUserLoggedIn(false)
            });
        }
        if (localStorage.getItem("token")) {
            verifyUserToken();
        }
        console.log("a");
    }, [])


    return <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
        {children}
    </AuthContext.Provider>
}
