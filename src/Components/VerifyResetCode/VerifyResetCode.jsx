import React, { useContext } from "react";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useMutation } from "react-query";

export default function VerifyResetCode() {
    const navigate = useNavigate();

    const verifyResetCodeMutation = useMutation({
        mutationFn: (values) => axios.post("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", values),
        onSuccess: () => {
            navigate("/updateUserPassword");
        },
    });

    const validationSchema = Yup.object({
        resetCode: Yup.string().required("Reset code is required."),
    });

    const formik = useFormik({
        initialValues: { resetCode: "" },
        validationSchema,
        onSubmit: (values) => verifyResetCodeMutation.mutate(values),
    });

    return (
        <>
            <ScrollToTop />
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <div className="w-full">
                    <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Verify Reset Code
                    </h2>
                </div>

                <div className="mt-10 w-full">
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="resetCode" className="block text-sm font-medium text-gray-900 dark:text-white">
                                Enter the reset code
                            </label>
                            <input
                                id="resetCode"
                                name="resetCode"
                                type="text"
                                maxLength={6}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.resetCode}
                                className="block w-full mt-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:text-white dark:bg-black outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-main"
                            />
                            {formik.touched.resetCode && formik.errors.resetCode && (
                                <div className="text-red-500">{formik.errors.resetCode}</div>
                            )}
                        </div>

                        {verifyResetCodeMutation.isError && (
                            <p className="text-red-500">Incorrect code. Check your email or request a new one.</p>
                        )}

                        <button
                            type="submit"
                            className="flex justify-center rounded-md bg-main px-8 py-1.5 text-sm font-semibold text-white hover:bg-hover focus:outline-main"
                            disabled={verifyResetCodeMutation.isLoading}
                        >
                            Submit
                            {verifyResetCodeMutation.isLoading && <i className="fas fa-spinner fa-spin ml-2"></i>}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
