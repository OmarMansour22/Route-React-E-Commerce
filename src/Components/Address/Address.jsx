import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { useMutation, useQuery } from 'react-query';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

export default function Address() {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isNewAddress, setIsNewAddress] = useState(false);
    const { cartId } = useParams();
    const token = localStorage.getItem("token");
    const addressContainerRef = useRef(null);

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required.").min(2, "Name must be at least 2 characters.").max(20, "Name cannot exceed 20 characters."),
        details: Yup.string().min(7, "Address must be at least 7 characters.").max(200, "Address cannot exceed 200 characters.").required("Address details are required."),
        phone: Yup.string().required("Phone is required.").matches(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/, "Enter a valid phone number."),
        city: Yup.string().min(2, "City name must be at least 2 characters.").max(20, "City name cannot exceed 20 characters.").required("City is required."),
    });

    const { data: addresses, refetch: fetchAddresses, isLoading: isLoadingAddresses } = useQuery('addresses',
        async () => {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/addresses", {
                headers: { token },
            });
            return data.data;
        }
    );

    const removeAddressMutation = useMutation(
        async (id) => {
            await axios.delete(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
                headers: { token },
            });
            return id;
        },
        {
            onSuccess: (id) => {
                fetchAddresses();
                if (selectedAddress?._id === id) {
                    setSelectedAddress(null);
                }
            },
            onError: (error) => {
                console.error("Error removing address:", error);
            },
        }
    );

    const addAddressMutation = useMutation(
        async (values) => {
            await axios.post("https://ecommerce.routemisr.com/api/v1/addresses", values, {
                headers: { token },
            });
        },
        {
            onSuccess: () => {
                fetchAddresses();
                setIsNewAddress(false);
                formik.resetForm();
            },
            onError: (error) => {
                console.error("Failed to add address:", error);
            },
        }
    );

    const formik = useFormik({
        initialValues: {
            name: "",
            details: "",
            phone: "",
            city: ""
        },
        validationSchema,
        onSubmit: (values) => addAddressMutation.mutate(values),
    });

    async function handleCheckout() {
        if (!selectedAddress) {
            alert("Please select an address.");
            return;
        }

        try {
            const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=https://omarmansour22.github.io/Route-React-E-Commerce/`,
                { shippingAddress: selectedAddress },
                { headers: { token } }
            );
            window.open(data.session.url, "_blank");
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest(".address-container")) {
                setSelectedAddress(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (isLoadingAddresses) return <LoadingScreen />;

    return (
        <>
            <ScrollToTop />
            <div className="bg-white shadow-card dark:shadow-darkCard dark:bg-black dark:border-neutral-700 rounded-xl p-6 max-w-lg mx-auto border border-gray-200 address-container" ref={addressContainerRef}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Select or Add an Address</h2>

                <div className="space-y-4">
                    {addresses?.map(addr => (
                        <div key={addr._id} className={`flex justify-between items-center p-4 border dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-900 transition ${selectedAddress?._id === addr._id ? "border-blue-500" : "border-gray-300"}`} onClick={() => { setSelectedAddress(addr); setIsNewAddress(false); }}>
                            <div>
                                <p className="font-semibold dark:text-white">{addr.name}</p>
                                <p className="text-sm text-gray-600 dark:text-white">{addr.details}</p>
                                <p className="text-sm text-gray-500 dark:text-white">{addr.phone} - {addr.city}</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeAddressMutation.mutate(addr._id); }}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                disabled={removeAddressMutation.isLoading}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {!selectedAddress && (
                    <button onClick={() => setIsNewAddress(true)} className="w-full mt-4 py-3 bg-main text-white font-semibold rounded-lg hover:bg-blue-700 transition">Enter a New Address</button>
                )}

                {isNewAddress && (
                    <form className="space-y-3 mt-4" onSubmit={formik.handleSubmit}>
                        <input type="text" name="name" placeholder="Name" {...formik.getFieldProps("name")} className="p-3 w-full border dark:text-white dark:border-neutral-700 rounded-lg border-gray-500 outline-gray-700 text-gray-800" />
                        {formik.touched.name && formik.errors.name && <div className='text-red-500'>{formik.errors.name}</div>}

                        <input type="text" name="details" placeholder="Address Details" {...formik.getFieldProps("details")} className="p-3 w-full border dark:text-white dark:border-neutral-700 rounded-lg border-gray-500 outline-gray-700 text-gray-800" />
                        {formik.touched.details && formik.errors.details && <div className='text-red-500'>{formik.errors.details}</div>}

                        <input type="text" name="phone" placeholder="Phone Number" {...formik.getFieldProps("phone")} className="p-3 w-full border dark:text-white dark:border-neutral-700 rounded-lg border-gray-500 outline-gray-700 text-gray-800" />
                        {formik.touched.phone && formik.errors.phone && <div className='text-red-500'>{formik.errors.phone}</div>}

                        <input type="text" name="city" placeholder="City" {...formik.getFieldProps("city")} className="p-3 w-full border dark:text-white dark:border-neutral-700 rounded-lg border-gray-500 outline-gray-700 text-gray-800" />
                        {formik.touched.city && formik.errors.city && <div className='text-red-500'>{formik.errors.city}</div>}

                        <button type="submit" className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition" disabled={addAddressMutation.isLoading}>
                            {addAddressMutation.isLoading ? "Saving..." : "Save Address"}
                        </button>
                    </form>
                )}

                {selectedAddress && !isNewAddress && (
                    <button onClick={handleCheckout} className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 hover:cursor-pointer transition">
                        Checkout
                    </button>
                )}
            </div>
        </>
    );
}
