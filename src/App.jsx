import { RouterProvider, createHashRouter } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Cart from './Components/Cart/Cart'
import WishList from './Components/WishList/WishList'
import Categories from './Components/Categories/Categories'
import Home from './Components/Home/Home'
import NotFound from './Components/NotFound/NotFound'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import 'flowbite-react'
import AuthContextProvider from './Context/AuthContext'
import ProtectedRoute from './Components/Guards/ProtectedRoute/ProtectedRoute'
import AuthProtectedRoute from './Components/Guards/AuthProthectedRoute/AuthProtectedRoute'
import ProductDetails from './Components/ProductDetails/ProductDetails'
import CategoryDetails from './Components/CategoryDetails/CategoryDetails'
import { ToastContainer } from 'react-toastify';
import CartCountContextProvider from './Context/CartCountContext'
import Address from './Components/Address/Address'
import Orders from './Components/Orders/Orders'
import Products from './Components/Products/Products'
import { QueryClient, QueryClientProvider } from 'react-query'



function App() {

  const router = createHashRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <AuthProtectedRoute><Login /></AuthProtectedRoute> },
        { path: 'register', element: <AuthProtectedRoute><Register /></AuthProtectedRoute> },
        { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: 'wishList', element: <ProtectedRoute><WishList /></ProtectedRoute> },
        { path: 'categories', element: <ProtectedRoute><Categories /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
        { path: 'allorders', element: <ProtectedRoute><Orders /></ProtectedRoute> },
        { path: 'productDetails/:id/:categoryId', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
        { path: 'categoryDetails/:categoryId', element: <ProtectedRoute><CategoryDetails /></ProtectedRoute> },
        { path: 'address/:cartId', element: <ProtectedRoute><Address /></ProtectedRoute> },
        { path: '*', element: <NotFound /> },
      ]
    },
  ])

  let queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CartCountContextProvider>
            <RouterProvider router={router} /> <ToastContainer />
          </CartCountContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
