import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getAllCategories() {
    try {
      let response = await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
      setCategories(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto dark:bg-black">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : categories?.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
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
  );
}
