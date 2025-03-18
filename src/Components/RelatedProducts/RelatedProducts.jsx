import React from 'react'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RelatedProducts({ product }) {
    const dragCoords = useRef({ startX: 0, startY: 0 });
    let navigate= useNavigate();

    return (
        <>
                <div className='w-full my-12 p-4 shadow-card dark:shadow-darkCard relative overflow-hidden group rounded-lg cursor-pointer'>
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
                            navigate("/productDetails/" + product?.id + "/" + product?.category?._id );
                            
                        }}
                        className='cursor-pointer text-start focus:outline-none focus:ring-0 focus:ring-transparent'
                    >
                        <img src={product?.imageCover} alt="" className='w-full' />
                        <h3 className='font-bold text-xl my-1'>{product?.title.split(' ').slice(0, 2).join(' ')}</h3>
                        <div className="productDetail flex justify-between my-1">
                            <p className='font-medium my-1'>{product?.price} EGP</p>
                            <p className='font-medium my-1'>
                                <i className='fa-solid fa-star text-yellow-300'></i> {product?.ratingsAverage}
                            </p>
                        </div>
                    </button>
                </div>
        </>
    )
}
