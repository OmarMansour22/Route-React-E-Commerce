import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';

export default function Footer() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <footer className="bg-gray-100 dark:bg-neutral-900">
      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
        {/* Scroll to Top Button */}
        <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
          <button
            onClick={scrollToTop}
            className="inline-block cursor-pointer rounded-full bg-main hover:bg-blue-700 p-2 text-white shadow-sm transition duration-100 sm:p-3 lg:p-4"
          >
            <span className="sr-only">Back to top</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <button onClick={scrollToTop} className="flex justify-center text-main lg:justify-start">
              <Logo />
            </button>

            <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 dark:text-gray-300 lg:text-left">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt consequuntur amet culpa
              cum itaque neque.
            </p>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
            <li>
              <Link className="text-gray-900 hover:bg-secondary mx-[2px] dark:text-white hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-all" to="#">
                About
              </Link>
            </li>
            <li>
              <Link className="text-gray-900 hover:bg-secondary mx-[2px] dark:text-white hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-all" to="#">
                Services
              </Link>
            </li>
            <li>
              <Link className="text-gray-900 hover:bg-secondary mx-[2px] dark:text-white hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-all" to="#">
                Projects
              </Link>
            </li>
            <li>
              <Link className="text-gray-900 hover:bg-secondary mx-[2px] dark:text-white hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-all" to="#">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-300 lg:text-right">
          Copyright &copy; 2022. All rights reserved.
        </p>
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed md:bottom-6 md:right-6 bottom-3 right-3 flex items-center justify-center size-10 sm:size-14 rounded-full bg-gray-300 dark:bg-gray-700 shadow-lg transition-all hover:scale-105 hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        <i className={`${darkMode ? 'fa-regular  fa-sun text-yellow-400' : 'fa fa-moon text-gray-800'}  md:text-2xl text-lg`}></i>
      </button>
    </footer>
  );
}
