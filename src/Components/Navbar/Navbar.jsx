import React, { useContext } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '../Logo/Logo'
import { AuthContext } from '../../Context/AuthContext'
import { CartCountContext } from '../../Context/CartCountContext'

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Cart', to: '/cart' },
  { name: 'WishList', to: '/wishList' },
  { name: 'Products', to: '/products' },
  { name: 'Categories', to: '/categories' },
  { name: 'Orders', to: '/allorders' },
]



export default function Navbar() {
  const { setIsUserLoggedIn, isUserLoggedIn } = useContext(AuthContext)
  const { cartCount } = useContext(CartCountContext);
  console.log("ab", cartCount);

  let navigate = useNavigate();
  function logOut() {
    setIsUserLoggedIn(false);
    localStorage.removeItem("token")
    navigate("/login");
  }

  return (
    <Disclosure as="nav" className="bg-gray-50 py-2 shadow-sm fixed top-0 left-0 right-0 z-50 dark:bg-neutral-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-2 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden ">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-900 dark:text-white dark:bg-gray-950 hover:bg-main hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden " />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="w-full flex flex-1 items-center mx-auto justify-center lg:items-stretch lg:justify-between ">
            <Logo/>
            <div className="hidden lg:block text-center w-full">
              <div className="flex justify-center items-center">
                {navigation.map((item) => (
                  <NavLink key={item.name} to={item.to} aria-current={item.current ? 'page' : undefined} className='text-gray-900 dark:text-white hover:bg-secondary mx-[2px] hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-all'>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {!isUserLoggedIn &&
              <>
                <Link className='mx-2 font-semibold' to='/register'>Register</Link>
                <Link className='mx-2 font-semibold' to='login'>Login</Link>
              </>
            }
            {
              isUserLoggedIn &&
              <>
                <Link to={"/cart"} className="relative inline-block cursor-pointer">
                  <button className="pe-2 py-2 rounded-lg"><i className="fa-solid fa-2xl text-main fa-cart-shopping cursor-pointer"></i></button>
                  <sup className="absolute top-0 -right-3 -translate-y-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </sup>
                </Link>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 dark:focus:ring-offset-0 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img alt="" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" className="size-8 rounded-full w-full" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right overflow-hidden rounded-md bg-white dark:bg-gray-800 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <button
                        className="block w-full text-start px-4 py-3 text-sm text-gray-900 dark:text-white dark:bg-gray-800 dark:outline-0 data-focus:bg-secondary data-focus:outline-hidden transition-all"
                        onClick={() => { logOut() }}
                      >
                        Sign out
                      </button  >
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            }
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden w-full ">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton key={item.name} as={NavLink} to={item.to} aria-current={item.current ? 'page' : undefined} className={'text-gray-900 dark:text-white hover:bg-hover hover:text-white block rounded-md px-3 py-2 text-base font-medium'}>
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
