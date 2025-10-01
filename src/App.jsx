import { RouterProvider, createHashRouter } from "react-router-dom";
import "flowbite-react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import AuthProtectedRoute from "./Guards/AuthProthectedRoute/AuthProtectedRoute";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import VerifyResetCode from "./Pages/VerifyResetCode/VerifyResetCode";
import UpdateUserPassword from "./Pages/UpdateUserPassword/UpdateUserPassword";
import ProtectedRoute from "./Guards/ProtectedRoute/ProtectedRoute";
import WishList from "./Pages/WishList/WishList";
import Categories from "./Pages/Categories/Categories";
import Products from "./Pages/Products/Products";
import Orders from "./Pages/Orders/Orders";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import CategoryDetails from "./Pages/CategoryDetails/CategoryDetails";
import Address from "./Pages/Address/Address";
import NotFound from "./Pages/NotFound/NotFound";
import Cart from "./Pages/Cart/Cart";
import AuthContextProvider from "./Context/AuthContext";
import CartCountContextProvider from "./Context/CartCountContext";
// import { ReactQueryDevtools } from 'react-query/devtools'

function App() {
  const router = createHashRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "login",
          element: (
            <AuthProtectedRoute>
              <Login />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "register",
          element: (
            <AuthProtectedRoute>
              <Register />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "forgotPassword",
          element: (
            <AuthProtectedRoute>
              <ForgotPassword />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "verifyResetCode",
          element: (
            <AuthProtectedRoute>
              <VerifyResetCode />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "updateUserPassword",
          element: (
            <AuthProtectedRoute>
              <UpdateUserPassword />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "wishList",
          element: (
            <ProtectedRoute>
              <WishList />
            </ProtectedRoute>
          ),
        },
        { path: "categories", element: <Categories /> },
        { path: "products", element: <Products /> },
        {
          path: "allorders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
        { path: "productDetails/:id/:categoryId", element: <ProductDetails /> },
        { path: "categoryDetails/:categoryId", element: <CategoryDetails /> },
        {
          path: "address/:cartId",
          element: (
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  let queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CartCountContextProvider>
            <RouterProvider router={router} /> <ToastContainer />
          </CartCountContextProvider>
        </AuthContextProvider>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
