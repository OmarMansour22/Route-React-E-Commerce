import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartCountContext } from '../../Context/CartCountContext';
import { useMutation } from 'react-query';
import { AuthContext } from '../../Context/AuthContext';

export default function Product({ product, status, onWishlistUpdate }) {
    const [isFavourite, setIsFavourite] = useState(0);
    const { setCartCount } = useContext(CartCountContext);
    const { isUserLoggedIn } = useContext(AuthContext)
    let navigate = useNavigate();
    

    const addProductToCartMutation = useMutation(
        async () => {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/cart",
                { productId: product?.id },
                { headers: { token: localStorage.getItem("token") } }
            );
            return data;
        },
        {
            onSuccess: (data) => {
                if (localStorage.getItem("theme") === "light") {
                    toast.success(data?.message, { autoClose: 2000, closeOnClick: true });
                } else {
                    toast.success(data?.message, { autoClose: 2000, closeOnClick: true, theme: "dark" });
                }
                setCartCount(data?.numOfCartItems);
            },
            onError: (error) => {
                if (localStorage.getItem("theme") === "light") {
                    toast.error("Failed to add product to cart: " + error.message);
                } else {
                    toast.error("Failed to add product to cart: " + error.message, {
                        autoClose: 2000,
                        closeOnClick: true,
                        theme: "dark",
                    });
                }
            },
        }
    );

    const addProductToCart = () => {
        addProductToCartMutation.mutate();
    };

    const isAddingToCart = addProductToCartMutation.isLoading;

    const setToFavouriteMutation = useMutation(
        async () => {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId: product?.id },
                { headers: { token: localStorage.getItem("token") } }
            );
            return data;
        },
        {
            onSuccess: (data) => {
                if (localStorage.getItem("theme") === "light") {
                    toast.success(data?.message, { autoClose: 2000, closeOnClick: true });
                } else {
                    toast.success(data?.message, { autoClose: 2000, closeOnClick: true, theme: "dark" });
                }
                if (onWishlistUpdate) onWishlistUpdate();
            },
            onError: (error) => {
                setIsFavourite(false);
                if (localStorage.getItem("theme") === "light") {
                    toast.error("Failed to add to wishlist: " + error?.message, { autoClose: 2000, closeOnClick: true });
                } else {
                    toast.error("Failed to add to wishlist: " + error?.message, {
                        autoClose: 2000,
                        closeOnClick: true,
                        theme: "dark",
                    });
                }
            },
        }
    );

    const setToFavourite = () => {
        setIsFavourite(true);
        setToFavouriteMutation.mutate();
    };


    const removeFromFavouriteMutation = useMutation(
        async () => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${product?.id}`,
                { headers: { token: localStorage.getItem("token") } }
            );
            return data;
        },
        {
            onSuccess: (data) => {
                if (localStorage.getItem("theme") === "light") {
                    toast.success(data?.message, { autoClose: 2000, closeOnClick: true });
                } else {
                    toast.success(data?.message, { autoClose: 2000, closeOnClick: true, theme: "dark" });
                }
                if (onWishlistUpdate) onWishlistUpdate();
            },
            onError: (error) => {
                setIsFavourite(true);
                if (localStorage.getItem("theme") === "light") {
                    toast.error("Failed to remove from wishlist: " + error?.message, { autoClose: 2000, closeOnClick: true });
                } else {
                    toast.error("Failed to remove from wishlist: " + error?.message, {
                        autoClose: 2000,
                        closeOnClick: true,
                        theme: "dark",
                    });
                }
            },
        }
    );

    const removeFromFavourite = () => {
        setIsFavourite(false);
        removeFromFavouriteMutation.mutate();
    };


    useEffect(() => {
        setIsFavourite(status);
    }, [status]);


    return (
        <>
            <div className='w-full p-3 shadow-card dark:shadow-darkCard relative overflow-hidden group rounded-lg'>
                <Link to={"/productDetails/" + product?.id + "/" + product?.category?._id}>
                    <img className='w-full mb-2' src={product?.imageCover} alt="" />
                    <h2 className='text-main text-xl  font-bold'>{product?.category?.name}</h2>
                    <h3 className='font-semibold my-1'>{product?.title?.split(' ').slice(0, 2).join(' ')}</h3>
                    <div className="productDetail flex justify-between my-1">
                        <p className='font-medium my-1'>{product?.price} EGP</p>
                        <p className='font-medium my-1'><i className='fa-solid fa-star text-yellow-300'></i> {product?.ratingsAverage}</p>
                    </div>
                </Link>
                <div className="flex">
                    <button disabled={isAddingToCart} onClick={() => {
                        isUserLoggedIn ? addProductToCart() : navigate("/login")
                    }} className={`${isAddingToCart ? 'cursor-auto' : 'cursor-pointer'} w-full bg-white py-2 mr-2 rounded-lg text-white relative opacity-0 translate-y-full transition-all group-hover:opacity-100 group-hover:translate-y-0  group-hover:ease-in-out  group-hover:bottom-0 group-hover:bg-main  group-hover:duration-200 hover:bg-blue-700 hover:duration-100`}>Add to Cart{isAddingToCart && <i className="fas fa-spinner fa-spin  flex items-center justify-center py-1.5 px-1"></i>}</button>
                    <button onClick={() => {
                        if (isUserLoggedIn) isFavourite ? removeFromFavourite() : setToFavourite()
                        else navigate("/login")
                    }} className={`hover:text-yellow-400 hover:transition-all hover:duration-200 cursor-pointer ${isFavourite ? 'text-yellow-400' : 'text-gray-300 '}`}><i className="fa-solid fa-heart fa-2x"></i></button>
                </div>
            </div>
        </>

    )
}
