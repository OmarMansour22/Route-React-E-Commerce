import axios from 'axios';
import React from 'react'
import { Link } from 'react-router-dom';
import Product from '../Product/Product';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { useQuery } from 'react-query';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

export default function WishList() {

  function favourite() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: { token: localStorage.getItem("token") },
    }).then(response => response.data.data);
  }

  let { data: productArray, isLoading, refetch } = useQuery('favourite', favourite, {
    refetchInterval: 60000
  })


  if (isLoading) return <LoadingScreen />


  return (
    <>
      <ScrollToTop />
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
            return <Product product={product} status={1} key={product.id} onWishlistUpdate={refetch}></Product>
          })}
        </div>

      }
    </>
  )
}
