import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo() {

    return (
        <Link to='./' className="flex shrink-0 items-center justify-center ml-5 sm:m-0">
            <i _ngcontent-njr-c20="" className="fa-solid fa-cart-shopping nav-icon fa-2xl text-main"></i>
            <h1 className='text-2xl p-0 m-0 font-bold text-black dark:text-white'>Fresh Cart</h1>
        </Link>
    )
}
