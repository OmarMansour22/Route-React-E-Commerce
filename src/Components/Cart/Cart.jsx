import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import CartProduct from '../CartProduct/CartProduct';
import { CartCountContext } from '../../Context/CartCountContext';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { toast } from 'react-toastify';


export default function Cart() {
  const [totalCartPrice, setTotalCartPrice] = useState();
  const { cartCount, setCartCount } = useContext(CartCountContext);
  const [checkPrice, setCheckPrice] = useState(0);
  const [changing, setChanging] = useState(0);
  const navigate = useNavigate();


  function getUserCart() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: {
        token: localStorage.getItem("token")
      }
    }).then(response => response.data.data);
  }

  let { data: cartProducts, isLoading: isLoadingUserCart, isFetching: isFetchingUserCart, refetch: refetchUserCart } = useQuery('userCart', getUserCart, {
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (cartProducts) setTotalCartPrice(cartProducts?.totalCartPrice)
  }, [cartProducts])


  const removeItemMutation = useMutation(
    async (productId) => {
      const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        headers: { token: localStorage.getItem("token") }
      });
      return data;
    },
    {
      onSuccess: (data) => {
        setTotalCartPrice(data?.data?.totalCartPrice);
        setCartCount(prev => prev - 1);
      },
      onError: (error) => {
        refetchUserCart();
        toast.error(`Error removing item: ${error}`, {
          autoClose: 2000,
          theme: localStorage.getItem("theme") === "light" ? "light" : "dark",
        });
      }
    }
  );

  const removeItem = (productId) => {
    removeItemMutation.mutate(productId);
  };

  const updateProductNumberMutation = useMutation(
    async ({ productId, count }) => {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setTotalCartPrice(data?.data?.totalCartPrice);
        setChanging(0);
      },
      onError: (error) => {
        refetchUserCart()
        toast.error(`Error updating product quantity: ${error}`, {
          autoClose: 2000,
          theme: localStorage.getItem("theme") === "light" ? "light" : "dark",
        });
      },

    }
  );

  const updateProductNumber = (productId, count) => {
    updateProductNumberMutation.mutate({ productId, count });
  };



  const clearCartMutation = useMutation(
    async () => {
      const { data } = await axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      return data;
    },
    {
      onSuccess: () => {
        setTotalCartPrice(0);
        setCartCount(0);
        refetchUserCart();
      },
      onError: (error) => {
        refetchUserCart();
        toast.error(`Error clearing cart: ${error}`, {
          autoClose: 2000,
          theme: localStorage.getItem("theme") === "light" ? "light" : "dark",
        });
      },
    }
  );

  const clearCart = () => {
    clearCartMutation.mutate();
  };


  const isFetchingCart = isFetchingUserCart || removeItemMutation.isLoading || clearCartMutation.isLoading || updateProductNumberMutation.isLoading || changing;



  const handleCheckout = async () => {
    await refetchUserCart();
    navigate(`/address/${cartProducts?._id}`);
    setCheckPrice(0);
  };


  if (isLoadingUserCart) {
    return <LoadingScreen />;
  }


  return (
    <>
      <ScrollToTop />
      {cartCount ?
        <div className='py-10 rounded-md'>
          <button disabled={isFetchingCart} onClick={() => {
            refetchUserCart();
            setTotalCartPrice(0);
            setCartCount(0);
            clearCart();
          }} className={`text-red-500 dark:border-red-600 text-xl border px-5 py-1 rounded-md ms-auto me-1 md:me-10 block hover:bg-red-500 hover:text-white duration-300 ${isFetchingCart ? 'cursor-auto' : 'cursor-pointer'}`}>Clear Cart</button>
          <div className='w-full md:px-10'>
            {cartProducts?.products?.map((product) => {
              return <CartProduct key={product?._id} product={product} removeItem={removeItem} updateProductNumber={updateProductNumber} checkPrice={checkPrice} setChanging={setChanging} changing={changing} />
            })}
          </div>
          <div className="mt-10 md:mx-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <p className="text-2xl font-semibold text-gray-800 dark:text-white sm:w-fit">
              Total Price:
              <span className="text-main text-3xl font-bold ml-2">
                {totalCartPrice}
                {isFetchingCart ? <i className="fas fa-spinner fa-spin ml-2 text-gray-600"></i> : null}
              </span>
            </p>

            <button
              onClick={() => { setCheckPrice(1), handleCheckout() }}
              disabled={isFetchingCart}
              className={`text-white text-xl font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${!isFetchingCart
                ? 'bg-main hover:bg-blue-800 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed pointer-events-none'
                }`}
            >
              Checkout
            </button>
          </div>

        </div>
        :
        <div className="bg-white h-screen -mt-20 flex items-center justify-center dark:bg-black dark:text-white ">
          <div className="px-4 mx-auto">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-3xl font-bold">Your basket is empty!</h1>
              <h2 className="mb-4 text-2xl font-medium">Go on, stock up and order your faves.</h2>
              <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-main">Back to Homepage</Link>
            </div>
          </div>
        </div>}

    </>
  )
}
