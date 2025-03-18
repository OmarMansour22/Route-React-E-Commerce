import axios from 'axios';
import React from 'react';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

export default function Categories() {
  function getAllCategories() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/categories").then(response => response.data.data);
  }

  let { data: categories, isLoading } = useQuery('categories', getAllCategories, {
    refetchInterval: 60000
  })


  if (isLoading) return <LoadingScreen />

  return (
    <>
      <ScrollToTop />
      <div className="p-6 max-w-6xl mx-auto dark:bg-black">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        {categories?.length === 0 ? (
          <div className="bg-white h-screen -mt-20 flex items-center justify-center dark:bg-black">
            <div className="px-4 mx-auto">
              <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-3xl font-bold text-red-500">Oops! Looks like No Categories Found. </h1>
                <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-main">Back to Homepage</Link>
              </div>
            </div>
          </div>) : (
          <div className="grid grid-cols-12 gap-6 dark:bg-black">
            {categories?.map((category) => (
              <Link
                key={category._id}
                to={"/categoryDetails/" + category._id}
                className="bg-white rounded-lg shadow-card dark:shadow-darkCard dark:bg-black overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 
                 col-span-12 sm:col-span-6 lg:col-span-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-80 object-cover object-top"
                />
                <h3 className="text-lg font-semibold text-center py-3">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
