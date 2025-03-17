import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'


export const CartCountContext = createContext(0);


export default function CartCountContextProvider({ children }) {

  const [cartCount, setCartCount] = useState(0);
  async function getUserCart() {
    try {
      let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: {
          token: localStorage.getItem("token")
        }
      })
      setCartCount(data.numOfCartItems);
      console.log("here1", data.numOfCartItems);
      console.log("here2", cartCount);
    } catch (error) {

    }
  }

  useEffect(() => {
    getUserCart();
  }, [])



  return (
    <CartCountContext.Provider value={{cartCount,setCartCount}}>
      {children}
    </CartCountContext.Provider>
  )
}
