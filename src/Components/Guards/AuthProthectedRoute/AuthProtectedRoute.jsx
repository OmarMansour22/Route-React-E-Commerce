import React, { useContext } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import { Navigate } from 'react-router-dom'



export default function AuthProtectedRoute({children}) {
  const { isUserLoggedIn } = useContext(AuthContext)
  
  return (
    <>
      {!isUserLoggedIn ? children : <Navigate to={"/"}></Navigate>}
    </>
  )
}
