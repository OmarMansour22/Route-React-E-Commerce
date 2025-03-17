import React from 'react'
import { Link } from 'react-router-dom'

export default function NoAvailableProducts() {
    return (
        <div className="bg-white h-screen -mt-20 flex items-center justify-center dark:bg-black">
            <div className="px-4 mx-auto">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-3xl font-bold text-red-500">Oops! Looks like we are out of stock in this category. Stay tuned for new arrivals! </h1>
                    <Link to="/" className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 bg-main">Back to Homepage</Link>
                </div>
            </div>
        </div>
    )
}
