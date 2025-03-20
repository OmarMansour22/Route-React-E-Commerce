import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { useMutation } from "react-query";

export default function Login() {
  const navigate = useNavigate();
  const { setIsUserLoggedIn } = useContext(AuthContext);

  const loginMutation = useMutation({
    mutationFn: (values) => axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", values),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      setIsUserLoggedIn(true);
      navigate(location.pathname);
    },
  });

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required.").matches(/[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/, "Enter a valid email."),
    password: Yup.string().required("Password is required."),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => loginMutation.mutate(values),
  });

  return (
    <>
      <ScrollToTop />
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <div className="w-full">
          <h2 className="mt-10 text-left text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Login Now
          </h2>
        </div>

        <div className="mt-10 w-full">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                Email address
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:text-white dark:bg-black outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-main"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                id="password" name="password" type="password" autoComplete="current-password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:text-white dark:bg-black outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-main"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}
            </div>

            <div className="w-full flex justify-end">
              <Link to={"/forgotPassword"} className="text-red-500">
                Forgot password?
              </Link>
            </div>

            {loginMutation.isError && <p className="text-red-500">Incorrect email or password.</p>}

            <button
              type="submit"
              className="flex justify-center rounded-md bg-main px-8 py-1.5 text-sm font-semibold text-white hover:bg-hover focus:outline-main"
              disabled={loginMutation.isLoading}
            >
              Login
              {loginMutation.isLoading && <i className="fas fa-spinner fa-spin ml-2"></i>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
