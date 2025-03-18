import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import Slider from 'react-slick'
import RelatedProducts from '../RelatedProducts/RelatedProducts'
import { toast } from 'react-toastify'
import { CartCountContext } from '../../Context/CartCountContext'
import { useMutation, useQuery } from 'react-query'
import ScrollToTop from '../ScrollToTop/ScrollToTop'


export default function ProductDetails() {

    let { id, categoryId } = useParams();
    const [changeImageCover, setChangeImageCover] = useState(null);

    const [isFavourite, setIsFavourite] = useState(false);
    const { setCartCount } = useContext(CartCountContext);
    const [favProducts, setFavProducts] = useState(new Set())




    const settings = {
        dots: true,
        infinite: true,
        className: "center",
        centerPadding: "60px",
        slidesToShow: 5,
        arrows: false,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };
    const smallImageSettings = {
        infinite: false,
        dots: true,
        className: "center",
        centerPadding: "60px",
        slidesToShow: 3,
        swipeToSlide: true,
        arrows: false,
    };


    function getProduct() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/products/" + id).then(response => response.data.data);
    }

    let { data: response, isLoading: isLoadingProduct, refetch: refetchGetProduct } = useQuery('product', getProduct, {
        refetchInterval: 60000
    })

    useEffect(() => {
        if (response) setChangeImageCover(response?.imageCover);
    }, [response, id])


    function getRelatedProduct() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=7&category[in]=" + categoryId).then(response => response.data.data);
    }

    let { data: relatedProduct, isLoading: isLoadingRelatedProduct, refetch: refetchGetRelatedProduct } = useQuery('relatedProduct', getRelatedProduct, {
        refetchInterval: 60000
    })


    useEffect(() => {
        refetchGetProduct();
        refetchGetRelatedProduct();
    }, [id])

    function favourite() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: {
                token: localStorage.getItem("token")
            }
        }).then(response => response.data.data);
    }

    let { data: favouriteData, isLoading: isLoadingfavourite, refetch: refetchfavourite } = useQuery('favourite', favourite, {
        refetchInterval: 60000
    })

    useEffect(() => {
        if (favouriteData) {
            setFavProducts(new Set(favouriteData?.map(fav => fav._id) || []));
            setIsFavourite(new Set(favouriteData?.map(fav => fav._id) || [])?.has(id));
        }
    }, [favouriteData])



    useEffect(() => {
        refetchGetProduct();
        refetchGetRelatedProduct();
        refetchfavourite();
    }, [id])

    useEffect(() => {
        setIsFavourite(favProducts.has(id));
    }, [favProducts, id]);

    const addProductToCartMutation = useMutation(
        async () => {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/cart",
                { productId: id },
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return data;
        },
        {
            onSuccess: (data) => {
                const theme = localStorage.getItem("theme");
                toast.success(data?.message, { autoClose: 2000, closeOnClick: true, theme: theme === "light" ? "light" : "dark" });
                setCartCount(data?.numOfCartItems);
            },
            onError: () => {
                const theme = localStorage.getItem("theme");
                toast.error("Failed to add product to cart", { autoClose: 2000, closeOnClick: true, theme: theme === "light" ? "light" : "dark" });
            },
        }
    );

    const addProductToCart = (productId) => {
        addProductToCartMutation.mutate(productId);
    };

    const isAddingToCart = addProductToCartMutation.isLoading;

    const setToFavouriteMutation = useMutation(
        async () => {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId: id },
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return data;
        },
        {
            onMutate: () => {
                setIsFavourite(true);
            },
            onSuccess: (data) => {
                const theme = localStorage.getItem("theme");
                toast.success(data.message, { autoClose: 2000, closeOnClick: true, theme: theme === "light" ? "light" : "dark" });
            },
            onError: (error) => {
                setIsFavourite(false);
                const theme = localStorage.getItem("theme");
                toast.error("Failed to add to favourites", { autoClose: 2000, closeOnClick: true, theme: theme === "light" ? "light" : "dark" });
            }
        }
    );

    const setToFavourite = () => {
        setToFavouriteMutation.mutate(id);
    };

    const removeFromFavouriteMutation = useMutation(
        async () => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${id}`,
                {
                    headers: { token: localStorage.getItem("token") },
                }
            );
            return data;
        },
        {
            onMutate: () => {
                setIsFavourite(false);
            },
            onSuccess: (data) => {
                const theme = localStorage.getItem("theme");
                toast.success(data.message, { autoClose: 2000, closeOnClick: true, theme: theme === "light" ? "light" : "dark" });
            },
            onError: () => {
                setIsFavourite(true);
                const theme = localStorage.getItem("theme");
                toast.error("Failed to remove from favourites", { autoClose: 2000, closeOnClick: true, theme: theme === "light" ? "light" : "dark" });

            },
        }
    );

    const removeFromFavourite = () => {
        removeFromFavouriteMutation.mutate(id);
    };


    if (isLoadingProduct || isLoadingRelatedProduct || isLoadingfavourite) {
        return <LoadingScreen />
    }

    return (
        <>
            <ScrollToTop />
            < div className="" >
                <div className="grid grid-cols-12">
                    <div className="col-span-8 col-start-3 md:col-span-4 mb-8">
                        <img src={changeImageCover} alt="Product"
                            className="w-full h-auto rounded-lg shadow-md mb-4 dark:shadow-darkCard" />
                        <Slider {...smallImageSettings} className='mt-4'>
                            {response?.images?.map((image, index) => {
                                return <img src={image} alt="Thumbnail 1" key={index}
                                    className="w-25 h-35 object-center object-contain rounded-md cursor-pointer"
                                    onClick={() => { setChangeImageCover(image) }} />
                            })}
                        </Slider>
                    </div>

                    <div className="col-span-12 md:col-start-6 md:col-span-7">
                        <h2 className="text-3xl font-bold mb-2">{response?.title}</h2>
                        <p className="text-gray-600 mb-4">{response?.description}</p>
                        <div className="mb-4">
                            {response?.priceAfterDiscount == undefined ? <span className="text-2xl font-bold mr-2">{response.price} EGP</span> :
                                <>
                                    <span className="text-2xl font-bold mr-2">{response?.priceAfterDiscount} EGP</span>
                                    <span className="text-gray-500 line-through">{response?.price} EGP</span>
                                </>
                            }
                        </div>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-6 h-4 ${index < response?.ratingsAverage ? "text-yellow-300" : "text-gray-300"} me-1`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 20"
                                >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            ))}
                            <p className="ms-1 text-sm font-medium text-gray-500">{response?.ratingsAverage}</p>
                            <p className="ms-1 text-sm font-medium text-gray-500">out of</p>
                            <p className="ms-1 text-sm font-medium text-gray-500">5</p>
                        </div>

                        <div className='mt-12'>
                            <p className="text-main text-3xl my-6">{response?.category?.name}</p>
                            <div className="flex space-x-4 mb-6 mt-50">
                                <button
                                    disabled={isAddingToCart}
                                    onClick={addProductToCart}
                                    className={`${isAddingToCart ? 'cursor-auto' : 'cursor-pointer'} bg-main flex gap-2 items-center text-white px-16 py-2 rounded-md hover:duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    Add to Cart
                                    {isAddingToCart && <i className="fas fa-spinner fa-spin  flex items-center justify-center py-1.5 px-1"></i>}
                                </button>
                                <button onClick={() => {
                                    isFavourite ? removeFromFavourite() : setToFavourite()
                                }} className={`hover:text-yellow-400 hover:transition-all hover:duration-200 cursor-pointer ${isFavourite ? 'text-yellow-400' : 'text-gray-300 '}`}><i className="fa-solid fa-heart fa-2x"></i></button></div>
                        </div>
                    </div>
                </div>

                <h2 className='text-4xl font-semibold my-16'>Customers Also Bought</h2>
                <Slider {...settings} className='my-16'>
                    {relatedProduct?.filter(product => product?._id !== id).map((product) => (
                        <RelatedProducts product={product} key={product?._id} />
                    ))}
                </Slider>
            </div>

        </>
    )
}












