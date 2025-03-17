import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let userData = jwtDecode(localStorage.getItem("token"));

    async function getAllOrders() {
        try {
            let response = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userData.id}`);
            setOrders(response.data);
            console.log(response);

        } catch (err) {
            setError("Failed to fetch orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {loading ? (
                <LoadingScreen />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : orders?.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
            ) : (
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
    );
}