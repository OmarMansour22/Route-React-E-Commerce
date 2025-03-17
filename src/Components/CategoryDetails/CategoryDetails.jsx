import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import NoAvailableProducts from '../NoAvailableProducts/NoAvailableProducts';

export default function CategoryDetails() {

    let {categoryId} = useParams();
    const [categorieResponse, setCategorieResponse] = useState([])
    const [response, setResponse] = useState(false)
    const [favProducts, setFavProducts] = useState(new Set());

    async function getCategoryDetails() {
        let response = await axios.get("https://ecommerce.routemisr.com/api/v1/products?category[in]=" + categoryId)
        setCategorieResponse(response.data.data);
        console.log(response.data.data);
        setResponse(true);
    }

    async function favourite() {
        let { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist",
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            }
        )
        console.log(data.data);
        const favIds = new Set(data.data?.map(fav => fav._id) || []);
        setFavProducts(favIds);
        console.log("data");
    }


    useEffect(() => {
        getCategoryDetails();
        favourite();
    }, [])

    if (!response) {
        return <LoadingScreen />
    }
    else if (categorieResponse.length == 0) {
        return <NoAvailableProducts />
    }

    return (
        <>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {categorieResponse.map((product) => {
                    const isFav = favProducts?.has(product.id) ? 1 : 0;                    
                    return <Product product={product} status={isFav} key={product.id}></Product>
                })}
            </div>
        </>
    )
}
