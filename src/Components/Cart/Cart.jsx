import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import CartProduct from '../CartProduct/CartProduct';
import { CartCountContext } from '../../Context/CartCountContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartProducts, setCartProducts] = useState({});
  const [responded, setResponded] = useState(false);
  const [updateResponse, setUpdateResponse] = useState(true);
  const [totalCartPrice, setTotalCartPrice] = useState();

  const { cartCount, setCartCount } = useContext(CartCountContext);


  async function getUserCart() {
    let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: {
        token: localStorage.getItem("token")
      }
    });
    // console.log(data.data, 'all');
    setCartProducts(data.data);
    setTotalCartPrice(data.data.totalCartPrice);
    // console.log(totalCartPrice);    
    setResponded(true);
  }

  async function removeItem(productId) {
    setCartCount(cartCount - 1);
    let { data } = await axios.delete("https://ecommerce.routemisr.com/api/v1/cart/" + productId, {
      headers: {
        token: localStorage.getItem("token")
      }
    })
    // setCartProducts(data.data);
    setTotalCartPrice(data.data.totalCartPrice);
    console.log(totalCartPrice);
    setTimeout(() => {
      setUpdateResponse(true);
    }, 2000);
  }

  async function updateProductNumber(productId, count) {
    if (!count) setCartCount(cartCount - 1);
    let { data } = await axios.put("https://ecommerce.routemisr.com/api/v1/cart/" + productId, { count: count }, {
      headers: {
        token: localStorage.getItem("token")
      }
    })
    // setCartProducts(data.data);
    setTotalCartPrice(data.data.totalCartPrice)
    setUpdateResponse(true);
    // console.log(totalCartPrice);
    // console.log("new", data.data);
  }

  async function clearCart() {
    let { data } = await axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: {
        token: localStorage.getItem("token")
      }
    })
    setUpdateResponse(true);
    // console.log(totalCartPrice);
    // console.log("clr", data);
  }

  useEffect(() => {
    getUserCart();
  }, [])

  if (!responded) {
    return <LoadingScreen />;
  }


  return (
    <>
      {cartCount ?
        <div className='py-10 rounded-md'>
          <button disabled={!cartCount} onClick={() => {
            setUpdateResponse(false);
            setCartProducts([]);
            setTotalCartPrice(0);
            setCartCount(0);
            clearCart();
          }} className={`text-red-500 dark:border-red-600 text-xl border px-5 py-1 rounded-md ms-auto me-1 md:me-10 block hover:bg-red-500 hover:text-white duration-300${!cartCount ? 'cursor-pointer' : 'cursor-auto'}`}>Clear Cart</button>
          <div className='w-full md:px-10'>
            {cartProducts?.products?.map((product) => {
              return <CartProduct key={product._id} product={product} removeItem={removeItem} updateProductNumber={updateProductNumber} setUpdateResponse={setUpdateResponse} />
            })}
          </div>
          <div className="mt-10 md:mx-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <p className="text-2xl font-semibold text-gray-800 dark:text-white sm:w-fit">
              Total Price:
              <span className="text-main text-3xl font-bold ml-2">
                {totalCartPrice}
                {!updateResponse && <i className="fas fa-spinner fa-spin ml-2 text-gray-600"></i>}
              </span>
            </p>

            <Link
              to={'/address/' + cartProducts._id}
              className={`text-white text-xl font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${updateResponse
                  ? 'bg-main hover:bg-blue-800 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}>
              Checkout
            </Link>
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
