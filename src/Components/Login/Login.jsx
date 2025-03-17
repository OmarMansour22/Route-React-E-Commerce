import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import ScrollToTop from '../ScrollToTop/ScrollToTop';


export default function Login() {
  let [isLoading, setIsLoading] = useState(false);
  let [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { setIsUserLoggedIn } = useContext(AuthContext)


  let validationSchema = Yup.object({
    email: Yup.string().required("Email is required.").matches(/[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/, "Enter a valid email."),
    password: Yup.string().required("Password is required.")
  });


  const formik = useFormik({
    initialValues: {
      "email": "",
      "password": "",
    },
    onSubmit,
    validationSchema
  })

  async function onSubmit() {
    setIsLoading(true);
    setIsError(false);
    let response = axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", formik.values)
      .then(function (response) {
        localStorage.setItem("token", response.data.token)
        setIsLoading(false);
        setIsUserLoggedIn(true);
        navigate(location.pathname)
      })
      .catch(function (error) {
        setIsLoading(false);
        setIsError(true);
      });
  }





  return (
    <>
      <ScrollToTop />
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <div className="sm:mx-auto w-full">
          <h2 className="mt-10 text-left text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white dark:bg-black">Login Now</h2>
        </div>

        <div className="mt-10 sm:mx-auto w-full">
          <form action="#" method="POST" className="space-y-6" onSubmit={formik.handleSubmit}>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white dark:bg-black">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:text-white dark:bg-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-main sm:text-sm/6" />
              {formik.touched.email && formik.errors.email && <div className='text-red-500'>{formik.errors.email}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-white dark:bg-black">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className="block w-full mt-2 rounded-md bg-brand px-3 py-1.5 text-base text-gray-900 dark:text-white dark:bg-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-main sm:text-sm/6" />
              {formik.touched.password && formik.errors.password && <div className='text-red-500'>{formik.errors.password}</div>}
            </div>

            <div>
              {isError && <p className='text-red-500'>Incorrect email or password.</p>}
            </div>

            <button type="submit" className="flex justify-center rounded-md bg-main px-8 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main">
              Login
              {isLoading && <i className="fas fa-spinner fa-spin  flex items-center justify-center py-1.5 px-1"></i>}
            </button>
          </form>
        </div>

      </div>
    </>
  )
}
