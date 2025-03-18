import React, { useContext, useEffect, useState } from 'react'
import Product from '../Product/Product';
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import CategorieSlider from '../CategorySlider/CategorieSlider';
import { useQuery } from 'react-query';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { AuthContext } from '../../Context/AuthContext';


export default function Home() {

  const [favProducts, setFavProducts] = useState(new Set())
  const { isUserLoggedIn } = useContext(AuthContext)
  
  function getProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products").then(response => response.data.data);
  }

  let { data: products, isLoading: isLoadingProducts } = useQuery('products', getProducts, {
    refetchInterval: 60000
  })

  function favourite() {
    return isUserLoggedIn && axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: { token: localStorage.getItem("token") },
    }).then(response => response.data.data);
  }

  let { data: favouriteData, isLoading: isLoadingFavourite } = useQuery('favourite', favourite, {
    refetchInterval: 60000
  })

  useEffect(() => {
    if (favouriteData && isUserLoggedIn) {
      setFavProducts(new Set(favouriteData?.map((fav) => fav._id) || []));
    }
  }, [favouriteData]);


  if ((isLoadingFavourite && isUserLoggedIn) || isLoadingProducts) {
    return <LoadingScreen />
  }

  return (
    <>
      <ScrollToTop />
      <CategorieSlider />
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 dark:bg-black">
        {products?.map((product) => {
          const isFav = favProducts?.has(product?.id) ? 1 : 0;
          return <Product product={product} status={isFav} key={product.id}></Product>
        })}
      </div>
    </>
  )
}
