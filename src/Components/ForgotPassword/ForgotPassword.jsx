import React from "react";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const forgotPasswordMutation = useMutation({
        mutationFn: (values) => axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", values),
        onSuccess: () => navigate("/verifyResetCode"),
    });

    const validationSchema = Yup.object({
        email: Yup.string().email("Enter a valid email.").required("Email is required."),
    });

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema,
        onSubmit: (values) => forgotPasswordMutation.mutate(values),
    });

    return (
        <>
            <ScrollToTop />
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <div className="w-full">
                    <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Reset Password
                    </h2>
                </div>

                <div className="mt-10 w-full">
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                                Enter your email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:text-white dark:bg-black outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-main"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500">{formik.errors.email}</div>
                            )}
                        </div>

                        {forgotPasswordMutation.isError && (
                            <p className="text-red-500">There is no user registered with this email address.</p>
                        )}

                        <button
                            type="submit"
                            className="flex justify-center rounded-md bg-main px-8 py-1.5 text-sm font-semibold text-white hover:bg-hover focus:outline-main"
                            disabled={forgotPasswordMutation.isLoading}
                        >
                            Reset
                            {forgotPasswordMutation.isLoading && <i className="fas fa-spinner fa-spin ml-2"></i>}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
