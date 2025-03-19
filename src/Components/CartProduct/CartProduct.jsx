import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CartProduct({ product, removeItem, updateProductNumber, checkPrice, setChanging }) {
    const [count, setCount] = useState(Math.min(product?.count, product?.product?.quantity));
    const [productLimit, setProductLimit] = useState(false);
    const timeoutRef = useRef(null);
    const latestCountRef = useRef(count);
    const hasWarnedRef = useRef(false);

    useEffect(() => {
        latestCountRef.current = count;
    }, [count]);

    function limitWarning() {
        if (!hasWarnedRef.current) {
            toast.warn(`Oops! You can only purchase ${product?.product?.quantity} ${product?.product?.title} at most.`, {
                autoClose: 2000,
                theme: localStorage.getItem("theme") === "light" ? "light" : "dark",
            });
            hasWarnedRef.current = true;
        }
    }

    const { data: latestProduct, refetch } = useQuery(
        `productPrice${product?.product?.id}`,
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
                    updateProductNumber(product?.product?.id, latestCountRef.current);
                }
            },
        }
    );

    useEffect(() => {
        if (product?.count > product?.product?.quantity) {
            limitWarning();
            updateProductNumber(product?.product?.id, product?.product?.quantity);
            setChanging(0);
        }
    }, [product?.count, product?.product?.quantity]);

    useEffect(() => {
        if (checkPrice) refetch();
    }, [checkPrice]);

    useEffect(() => {
        setCount(Math.min(product?.count, product?.product?.quantity));
    }, [product?.count, product?.product?.quantity]);

    const scheduleUpdate = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setChanging(0);
            updateProductNumber(product?.product?.id, latestCountRef.current);
        }, 1000);
    };


    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                updateProductNumber(product?.product?.id, latestCountRef.current);
            }
        };
    }, []);

    const handleIncrement = () => {
        if (count + 1 <= product?.product?.quantity) {
            setChanging(1);
            setProductLimit(false);
            setCount((prev) => prev + 1);
            scheduleUpdate();
        } else {
            setCount(product?.product?.quantity);
            setProductLimit(true);
            limitWarning();
            hasWarnedRef.current = false;
        }
    };

    const handleDecrement = () => {
        if (count > 1) {
            setChanging(1);
            setProductLimit(false);
            setCount((prev) => prev - 1);
            scheduleUpdate();
        } else {
            setCount(0);
            removeItem(product?.product?.id);
        }
    };

    return (
        <>
            {count > 0 ? (
                <Link to={"/productDetails/" + product?.product?.id + "/" + product?.product?.category?._id} className="w-full my-5 shadow-card dark:shadow-darkCard flex justify-between rounded-md overflow-hidden">
                    <div className="flex">
                        <img src={product?.product?.imageCover} alt="" className="w-28 object-contain -ml-1" />
                        <div className="p-3">
                            <h2 className="font-bold">{product?.product?.title?.split(" ").slice(0, 2).join(" ")}</h2>
                            <p className="text-main mb-7">{product?.product?.category.name}</p>
                            <p>{latestProduct?.price || product?.price} EGP</p>
                            <p>
                                {product?.product?.ratingsAverage} <i className="fa-solid fa-star text-yellow-400"></i>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-center p-2">
                        <button onClick={() => { setCount(0); removeItem(product?.product?.id); }} className="cursor-pointer text-red-500 text-xl md:me-7">
                            Remove <i className="fa-solid fa-trash"></i>
                        </button>
                        <div className={`${productLimit ? "bg-gray-200" : "bg-gray-50"} flex items-center dark:bg-neutral-800 dark:border-neutral-600 p-1 justify-center mb-2 md:me-7 border-1 border-gray-300 rounded-md`}>
                            <button onClick={handleDecrement} className="px-2 cursor-pointer rounded-md text-xl text-center hover:text-red-500 duration-100 outline-red-500">
                                -
                            </button>
                            <span className="text-xl px-3">{count}</span>
                            <button onClick={handleIncrement} className="px-2 cursor-pointer text-xl text-center hover:text-main duration-100 outline-main">
                                +
                            </button>
                        </div>
                    </div>
                </Link>
            ) : null}
        </>
    );
}
