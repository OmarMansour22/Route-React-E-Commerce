import React from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import { useQuery } from 'react-query';

export default function Orders() {
    let userData = jwtDecode(localStorage.getItem("token"));

    function getAllOrders() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userData.id}`).then(response => response.data);
    }

    let { data: orders, isLoading } = useQuery('AllOrders', getAllOrders, {
        refetchInterval: 60000 * 2
    })

    if (isLoading) return <LoadingScreen />

    return (
        <>
            <ScrollToTop />
            <div className="p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
                {orders?.length === 0 ? (
                    <div className="bg-white h-screen -mt-20 flex items-center justify-center dark:bg-black">
                        <div className="px-4 mx-auto">
                            <div className="mx-auto max-w-screen-sm text-center">
                                <h1 className="mb-4 text-3xl font-bold text-red-500">No Orders Found</h1>
                                <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-main">Back to Homepage</Link>
                            </div>
                        </div>
                    </div>) : (
                    <div className="grid gap-4">
                        {orders.map((order, index) => (
                            <div key={index} className="p-4 rounded-lg shadow-card dark:shadow-darkCard dark:bg-black dark:border dark:border-neutral-700 bg-white">
                                <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                                <p className="text-gray-600 dark:text-gray-300">Total Price: <span className="font-medium">${order.totalOrderPrice}</span></p>
                                <p className="text-gray-600 dark:text-gray-300">Payment Method: <span className="font-medium text-main">{order.paymentMethodType}</span></p>
                                <p className="text-gray-600 dark:text-gray-300">Paid: <span className={`font-medium ${order.isPaid ? 'text-green-500' : 'text-red-500'}`}>{order.isPaid ? 'Yes' : 'No'}</span></p>
                                <p className="text-gray-600 dark:text-gray-300">Delivered: <span className={`font-medium ${order.isDelivered ? 'text-green-500' : 'text-red-500'}`}>{order.isDelivered ? 'Yes' : 'No'}</span></p>
                                <p className="text-gray-600 dark:text-gray-300">Shipping City: {order.shippingAddress.city}</p>
                                <p className="text-gray-600 dark:text-gray-300">Items Count: {order.cartItems.length}</p>
                                <p className="text-gray-500 dark:text-gray-300 text-sm">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}