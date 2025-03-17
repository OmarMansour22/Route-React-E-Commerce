import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'


export default function Layout() {
    return (
        <>

            <div className='dark:bg-black'>
                <Navbar />
                <div className="container w-full 2xl:px-44 px-4 pt-36 pb-10 mx-auto min-h-screen dark:text-white">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    )
}
