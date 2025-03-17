import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col -mt-20 items-center justify-center h-screen text-gray-800 dark:text-white">
      <motion.h1 
        className="text-9xl font-extrabold text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        404
      </motion.h1>
      <motion.p 
        className="text-xl mt-4 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>
      <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-main">Back to Homepage</Link>
      
    </div>
  );
}
