import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop/ScrollToTop';



export default function Register() {
  const navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let [isError, setIsError] = useState(false);
  let [isErrorValue, setIsErrorValue] = useState("Error");

  let validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 character.").max(20, "Name cannot be bigger than 20 character.").required("Name is required."),
    email: Yup.string().required("Email is required.").matches(/[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/, "Enter a valid email."),
    phone: Yup.string().required("Phone is required.").matches(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/, "Enter a valid phone number."),
    password: Yup.string().required("Password is required.").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password must be at least 8 characters long and include at least one letter and one number."),
    rePassword: Yup.string().required("Confirmation password is required.").oneOf([Yup.ref('password')], "Confirmation password does not match.")
  });


  const formik = useFormik({
    initialValues: {
      "name": "",
      "email": "",
      "password": "",
      "rePassword": "",
      "phone": ""
    },
    onSubmit,
    validationSchema
  })

  async function onSubmit() {
    setIsLoading(true);
    setIsError(false);
    let response = axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", formik.values)
      .then(function (response) {
        // console.log(response);
        // console.log(response.data.message);
        setIsLoading(false);
        navigate("/login")

      })
      .catch(function (error) {
        // console.log(error);
        // console.log(error.response.data.message);
        setIsLoading(false);
        setIsError(true);
        setIsErrorValue(error.response.data.message);
      });
  }





  return (
    <>
      <ScrollToTop />
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md dark:bg-black">
        <div className="sm:mx-auto w-full">
          <h2 className="mt-10 text-left text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Register Now</h2>
        </div>

        <div className="mt-10 sm:mx-auto w-full">
          <form action="#" method="POST" className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:bg-black dark:text-white">Full Name</label>
              <input id="name" name="name" type="text" autoComplete="name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 dark:bg-black text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-main sm:text-sm/6" />
              {formik.touched.name && formik.errors.name && <div className='text-red-500'>{formik.errors.name}</div>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 dark:bg-black text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-main sm:text-sm/6" />
              {formik.touched.email && formik.errors.email && <div className='text-red-500'>{formik.errors.email}</div>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Phone Number</label>
              <input id="phone" name="phone" type="tel" autoComplete="phone" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 dark:bg-black dark:text-white  text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  sm:text-sm/6" />
              {formik.touched.phone && formik.errors.phone && <div className='text-red-500'>{formik.errors.phone}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className="block w-full mt-2 rounded-md bg-brand px-3 py-1.5 text-base text-gray-900 dark:bg-black dark:text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-main sm:text-sm/6" />
              {formik.touched.password && formik.errors.password && <div className='text-red-500'>{formik.errors.password}</div>}
            </div>

            <div>
              <label htmlFor="rePassword" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Confirm Password</label>
              <input id="rePassword" name="rePassword" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rePassword} className="block w-full mt-2 rounded-md bg-brand px-3 py-1.5 text-base text-gray-900 dark:bg-black dark:text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-main sm:text-sm/6" />
              {formik.touched.rePassword && formik.errors.rePassword && <div className='text-red-500'>{formik.errors.rePassword}</div>}
            </div>

            <div> {isError && <div className='text-red-500'>{isErrorValue}</div>} </div>

            <button type="submit" className="cursor-pointer flex justify-center rounded-md bg-main px-8 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main">
              Sign up
              {isLoading && <i className="fas fa-spinner fa-spin  flex items-center justify-center py-1.5 px-1"></i>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
