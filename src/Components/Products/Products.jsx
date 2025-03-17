import React, { useEffect, useState } from "react";
import Product from "../Product/Product";
import axios from "axios";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function Products() {
    const [products, setProducts] = useState(null); 
    const [filteredProducts, setFilteredProducts] = useState(null); 
    const [favProducts, setFavProducts] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    async function getProducts() {
        try {
            let response = await axios.get("https://ecommerce.routemisr.com/api/v1/products");
            setProducts(response.data.data);
            setFilteredProducts(response.data.data); 
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    async function favourite() {
        try {
            let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: localStorage.getItem("token") },
            });
            const favIds = new Set(data?.data?.map((fav) => fav._id) || []);
            setFavProducts(favIds);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }

    useEffect(() => {
        if (!products) return;
        const filtered = products.filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    useEffect(() => {
        getProducts();
        favourite();
    }, []);

    if (!products) {
        return <LoadingScreen />;
    }

    return (
        <>
            <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 mb-4 border rounded-lg border-gray-500 outline-gray-700 text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                        const isFav = favProducts.has(product.id) ? 1 : 0;
                        return <Product product={product} status={isFav} key={product.id} />;
                    })
                ) : (
                    <p className="text-gray-500 col-span-full text-center">No products found.</p>
                )}
            </div>
        </>
    );
}
