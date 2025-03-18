import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import NoAvailableProducts from '../NoAvailableProducts/NoAvailableProducts';
import { useQuery } from 'react-query';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

export default function CategoryDetails() {

    let { categoryId } = useParams();
    const [favProducts, setFavProducts] = useState(new Set());


    function getCategoryDetails() {
        return axios.get("https://ecommerce.routemisr.com/api/v1/products?category[in]=" + categoryId).then(response => response.data.data);
    }

    let { data: categorieResponse, isLoading: isLoadingCategoryDetails } = useQuery('categoryDetails'+categoryId, getCategoryDetails, {
        refetchInterval: 60000,
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


    if (isLoadingCategoryDetails || isLoadingFavourite) {
        return <LoadingScreen />
    }
    else if (categorieResponse?.length == 0) {
        return <NoAvailableProducts />
    }

    return (
        <>
            <ScrollToTop />
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {categorieResponse?.map((product) => {
                    const isFav = favProducts?.has(product.id) ? 1 : 0;
                    return <Product product={product} status={isFav} key={product?.id}></Product>
                })}
            </div>
        </>
    )
}
