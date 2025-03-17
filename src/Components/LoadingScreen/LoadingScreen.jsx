import React from 'react'
import style from './LoadingScreen.module.css'
import ScrollToTop from '../ScrollToTop/ScrollToTop'

export default function LoadingScreen() {
    return (
        <>
            <ScrollToTop />
            <div className="loadingScreen flex items-center justify-center min-h-screen absolute left-0 right-0 top-0 bottom-0 z-1 bg-white dark:bg-black">
                <div className={style.preloader}>
                    <svg className={style.cart} role="img" aria-label="Shopping cart line animation" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
                            <g className={style.cartTrack} stroke="hsla(0,10%,10%,0.1)">
                                <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
                                <circle cx="43" cy="111" r="13" />
                                <circle cx="102" cy="111" r="13" />
                            </g>
                            <g className={style.cartLines} stroke="currentColor">
                                <polyline className={style.cartTop} points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" strokeDasharray="338 338" strokeDashoffset="-338" />
                                <g className={style.cartWheel1} transform="rotate(-90,43,111)">
                                    <circle className={style.cartWheelStroke} cx="43" cy="111" r="13" strokeDasharray="81.68 81.68" strokeDashoffset="81.68" />
                                </g>
                                <g className={style.cartWheel2} transform="rotate(90,102,111)">
                                    <circle className={style.cartWheelStroke} cx="102" cy="111" r="13" strokeDasharray="81.68 81.68" strokeDashoffset="81.68" />
                                </g>
                            </g>
                        </g>
                    </svg>
                    <div className={style.preloaderText}>
                        <p className={style.preloaderMsg}>Bringing you the goods…</p>
                        <p className={`${style.preloaderMsg} ${style.preloaderMsgLast}`}>This is taking long. Something’s wrong.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
