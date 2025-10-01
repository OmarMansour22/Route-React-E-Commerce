import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useQuery } from 'react-query';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';
import CategorieSlider from '../../Components/CategorySlider/CategorieSlider';
import Product from '../../Components/Product/Product';
import { AuthContext } from '../../Context/AuthContext';
import { CartCountContext } from '../../Context/CartCountContext';


export default function Home() {
  const [favProducts, setFavProducts] = useState(new Set());
  const { isUserLoggedIn } = useContext(AuthContext);
  const { setCartCount } = useContext(CartCountContext);


  function getProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products").then(response => response.data.data);
  }

  let { data: products, isLoading: isLoadingProducts } = useQuery('products', getProducts, {
    refetchInterval: 60000
  })

  function favourite() {
    return isUserLoggedIn && (axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: { token: localStorage.getItem("token") },
    }).then(response => response.data.data));
  }

  let { data: favouriteData, isLoading: isLoadingFavourite, refetch } = useQuery('favourite', favourite, {
    refetchInterval: 60000
  })

  useEffect(() => {
    if (favouriteData && isUserLoggedIn) {
      setFavProducts(new Set(favouriteData?.map((fav) => fav._id) || []));
    }
  }, [favouriteData]);

  useEffect(() => {
    if (isUserLoggedIn) refetch();
  }, [isUserLoggedIn])


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
