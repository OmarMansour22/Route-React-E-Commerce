import axios from 'axios'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { useQuery } from 'react-query';

export default function CategorieSlider() {
    const dragCoords = useRef({ startX: 0, startY: 0 });
    let navigate = useNavigate();

    let settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    function fetchCategories() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/categories").then(response => response.data.data);
    }

    const { data: categories, isLoading } = useQuery("categories", fetchCategories, {
        refetchInterval: 60000
    });


    if (isLoading) {
        return <LoadingScreen />
    }


    return (
        <>
            <div className='dark:bg-black'>
                <h2 className='text-3xl font-semibold'>Shop Popular Categories</h2>
                <Slider {...settings} className='mb-16'>
                    {categories?.filter(product => product != []).map((product) => (
                        <div key={product?._id} className='w-full my-12 p-3 shadow-card dark:shadow-darkCard dark:border dark:border-gray-700 relative overflow-hidden group rounded-lg cursor-pointer'>
                            <button
                                onMouseDown={(e) => {
                                    dragCoords.current.startX = e.clientX;
                                    dragCoords.current.startY = e.clientY;
                                }}
                                onTouchStart={(e) => {
                                    const touch = e.touches[0];
                                    dragCoords.current.startX = touch.clientX;
                                    dragCoords.current.startY = touch.clientY;
                                }}
                                onClick={(e) => {
                                    // For touch events
                                    let endX, endY;
                                    if (e.type === 'touchend') {
                                        const touch = e.changedTouches[0];
                                        endX = touch.clientX;
                                        endY = touch.clientY;
                                    } else {
                                        endX = e.clientX;
                                        endY = e.clientY;
                                    }
                                    // Check if drag movement exceeds threshold
                                    if (Math.abs(endX - dragCoords.current.startX) > 5 || Math.abs(endY - dragCoords.current.startY) > 5) {
                                        return;
                                    }
                                    navigate("/categoryDetails/" + product._id)
                                }}
                                className='w-full cursor-pointer mx-auto text-center focus:outline-none focus:ring-0 focus:ring-transparent'
                            >
                                <img src={product?.image} alt="" className='size-100 mx-auto object-cover object-center' />
                                <h3 className='font-bold text-xl my-1'>{product?.name}</h3>
                            </button>
                        </div>
                    ))}
                </Slider>
            </div>

        </>
    )
}

