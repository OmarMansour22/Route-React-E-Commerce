import React, { useEffect, useState } from 'react'
import Product from '../Product/Product';
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import CategorieSlider from '../CategorySlider/CategorieSlider';


export default function Home() {

  const [products, setProducts] = useState(null)
  const [favProducts, setFavProducts] = useState(new Set())

  async function getProducts() {
    let response = await axios.get("https://ecommerce.routemisr.com/api/v1/products")
    console.log(response.data.data);
    console.log("response");
    setProducts(response.data.data);
  }

  async function favourite() {
    let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist",
      {
        headers: {
          token: localStorage.getItem("token")
        }
      }
    )
    console.log(data.data);
    const favIds = new Set(data.data?.map(fav => fav._id) || []);
    setFavProducts(favIds);
    console.log("data");
  }


  useEffect(() => {
    getProducts();
    favourite(); 
  }, [])

  if (!products) {
    return <LoadingScreen />
  }
  
  return (
    <>
    
      <CategorieSlider />
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 dark:bg-black">
        {products?.map((product) => {
          const isFav = favProducts?.has(product.id) ? 1 : 0;
          return <Product product={product} status={isFav} key={product.id}></Product>
        })}
      </div>
    </>
  )
}
