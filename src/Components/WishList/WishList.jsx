import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Product from '../Product/Product';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

export default function WishList() {

  const [productArray, setProductArray] = useState(null);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);


  async function favourite() {
    let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist",
      {
        headers: {
          token: localStorage.getItem("token")
        }
      }
    )
    console.log(data);
    setProductArray(data.data)
  }

  useEffect(() => {
    favourite()
  }, [wishlistUpdated])

  if (!productArray) return <LoadingScreen />


  return (
    <>
      {productArray?.length === 0 ?
        <div className="bg-white h-screen -mt-20 flex items-center justify-center dark:text-white dark:bg-black">
          <div className="px-4 mx-auto">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-3xl font-bold">Your wishlist is empty!</h1>
              <h2 className="mb-4 text-2xl font-medium">Go on, stock up and order your faves.</h2>
              <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-main">Back to Homepage</Link>
            </div>
          </div>
        </div>
        :
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
          {productArray?.map((product) => {
            return <Product product={product} status={1} key={product.id} onWishlistUpdate={() => setWishlistUpdated(prev => !prev)}></Product>
          })}
        </div>

      }
    </>
  )
}
