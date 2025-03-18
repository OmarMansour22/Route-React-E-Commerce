import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function CartProduct({ product, removeItem, updateProductNumber, checkPrice }) {
    const [count, setCount] = useState(Math.min(product?.count, product?.product?.quantity));
    const [productLimit, setProductLimit] = useState(false);

    let warned = false;

    function limitWarning() {
        if (localStorage.getItem("theme") === "light") {
            toast.warn(`Oops! You can only purchase ${count} ${product.product.title} at most.`, { autoClose: 2000 });
        } else {
            toast.warn(`Oops! You can only purchase ${count} ${product.product.title} at most.`, { autoClose: 2000, closeOnClick: true, theme: "dark" });
        }
        warned = true;
    }

    const { data: latestProduct, refetch } = useQuery(`productPrice${product?.product?.id}`,
        async () => {
            const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${product?.product?.id}`);
            return response.data.data;
        },
        {
            refetchInterval: 60000 * 10,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!product?.product?.id,
            onSuccess: (updatedProduct) => {
                if (updatedProduct?.price !== product?.price) {
                    toast.info(`Price updated: ${updatedProduct?.price} EGP`, { autoClose: 2000 });
                    updateProductNumber(product?.product?.id, count);
                }
            },
        }
    );

    useEffect(() => {
        if (product?.count > product?.product?.quantity && !warned) {
            limitWarning();
            updateProductNumber(product?.product?.id, product?.product?.quantity);
        }
    }, []);

    useEffect(() => {
        if (checkPrice) refetch();
    }, [checkPrice])


    return (
        <>
            {count ? (
                <div className='w-full my-5 shadow-card dark:shadow-darkCard flex justify-between rounded-md overflow-hidden'>
                    <div className='flex'>
                        <img src={product?.product?.imageCover} alt="" className='w-28 object-contain -ml-1' />
                        <div className='p-3'>
                            <h2 className='font-bold'>{product?.product?.title?.split(' ').slice(0, 2).join(' ')}</h2>
                            <p className='text-main mb-7'>{product?.product?.category.name}</p>
                            <p>{latestProduct?.price || product?.price} EGP</p>
                            <p>{product?.product?.ratingsAverage} <i className="fa-solid fa-star text-yellow-400"></i></p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-between items-center p-2'>
                        <button onClick={() => { setCount(0); removeItem(product?.product?.id); }} className="cursor-pointer text-red-500 text-xl md:me-7">
                            Remove <i className="fa-solid fa-trash"></i>
                        </button>
                        <div className={`${productLimit ? 'bg-gray-200' : 'bg-gray-50'} flex items-center dark:bg-neutral-800 dark:border-neutral-600 p-1 justify-center mb-2 md:me-7 border-1 border-gray-300 rounded-md`}>
                            <button onClick={() => { return (count - 1) ? (setProductLimit(false), setCount(count - 1), updateProductNumber(product?.product?.id, count - 1)) : (setProductLimit(false), setCount(count - 1), removeItem(product.product.id, count - 1)) }} className='px-2 cursor-pointer rounded-md text-xl text-center hover:text-red-500 duration-100 outline-red-500'>-</button>
                            <span className='text-xl px-3'>{count}</span>
                            <button onClick={() => {
                                return count + 1 <= product?.product?.quantity ?
                                    (setProductLimit(false), setCount(count + 1), updateProductNumber(product?.product?.id, count + 1)) :
                                    (setCount(product?.product?.quantity), setProductLimit(true), limitWarning());
                            }} className='px-2 cursor-pointer text-xl text-center hover:text-main duration-100 outline-main'>+</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
