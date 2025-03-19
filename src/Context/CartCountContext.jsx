import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';


export const CartCountContext = createContext(0);


export default function CartCountContextProvider({ children }) {
  const { isUserLoggedIn } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  async function getUserCart() {
    try {
      let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: {
          token: localStorage.getItem("token")
        }
      })
      setCartCount(data.numOfCartItems);
      // console.log("here1", data.numOfCartItems);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    if (isUserLoggedIn) getUserCart();
  }, [isUserLoggedIn])



  return (
    <CartCountContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartCountContext.Provider>
  )
}
