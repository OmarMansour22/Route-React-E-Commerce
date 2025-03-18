import React, { useEffect, useState } from "react";
import Product from "../Product/Product";
import axios from "axios";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useQuery } from "react-query";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

export default function Products() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [favProducts, setFavProducts] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    function getProducts() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/products").then(response => response.data.data);
    }

    let { data: products, isLoading: isLoadingProducts } = useQuery('products', getProducts, {
        refetchInterval: 60000
    })

    function favourite() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: { token: localStorage.getItem("token") },
        }).then(response => response.data.data);
    }

    let { data: favouriteData, isLoading: isLoadingFavourite } = useQuery('favourite', favourite, {
        refetchInterval: 60000
    })

    useEffect(() => {
        if (favouriteData) {
            setFavProducts(new Set(favouriteData?.map((fav) => fav._id) || []));
        }
    }, [favouriteData]);


    useEffect(() => {
        if (!products) return;
        const filtered = products?.filter((product) =>
            product?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);


    if (isLoadingFavourite || isLoadingProducts) {
        return <LoadingScreen />;
    }

    return (
        <>
            <ScrollToTop />
            <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 mb-4 border rounded-lg border-gray-500 outline-gray-700 text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {filteredProducts?.length > 0 ? (
                    filteredProducts?.map((product) => {
                        const isFav = favProducts?.has(product.id) ? 1 : 0;
                        return <Product product={product} status={isFav} key={product.id} />;
                    })
                ) : (
                    <p className="text-gray-500 col-span-full text-center">No products found.</p>
                )}
            </div>
        </>
    );
}
