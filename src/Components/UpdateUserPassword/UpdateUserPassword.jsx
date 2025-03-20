import React, { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useMutation } from "react-query";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";

export default function UpdateUserPassword() {
    let { setIsUserLoggedIn } = useContext(AuthContext);
    const updatePasswordMutation = useMutation({
        mutationFn: (values) =>
            axios.put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", values),
        onSuccess: (data) => {
            if (localStorage.getItem("theme") === "light") {
                toast.success("Password updated successfully!", { autoClose: 2000, closeOnClick: true });
            } else {
                toast.success("Password updated successfully!", { autoClose: 2000, closeOnClick: true, theme: "dark" });
            }
            console.log("data", data);

            localStorage.setItem("token", data.data.token);
            setIsUserLoggedIn(true);
        },
        onError: () => {
            if (localStorage.getItem("theme") === "light") {
                toast.error("Failed to update password. Please try again.", { autoClose: 2000, closeOnClick: true });
            } else {
                toast.error("Failed to update password. Please try again.", { autoClose: 2000, closeOnClick: true, theme: "dark" });
            }
        },
    });

    const validationSchema = Yup.object({
        email: Yup.string().email("Enter a valid email").required("Email is required"),
        newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
    });

    const formik = useFormik({
        initialValues: { email: "", newPassword: "" },
        validationSchema,
        onSubmit: (values) => updatePasswordMutation.mutate(values),
    });

    return (
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Update Password</h2>

            <form className="mt-6 space-y-6" onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                        Email
                    </label>
                    <input
                        id="email" name="email" type="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                        className="block w-full mt-2 rounded-md px-3 py-1.5 text-base text-gray-900 dark:text-white bg-white dark:bg-black outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-main"
                    />
                    {formik.touched.email && formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 dark:text-white">
                        New Password
                    </label>
                    <input
                        id="newPassword" name="newPassword" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.newPassword}
                        className="block w-full mt-2 rounded-md px-3 py-1.5 text-base text-gray-900 dark:text-white bg-white dark:bg-black outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-main"
                    />
                    {formik.touched.newPassword && formik.errors.newPassword && (
                        <div className="text-red-500">{formik.errors.newPassword}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="flex justify-center rounded-md bg-main px-8 py-1.5 text-sm font-semibold text-white hover:bg-hover focus:outline-main"
                    disabled={updatePasswordMutation.isLoading}
                >
                    Update Password
                    {updatePasswordMutation.isLoading && <i className="fas fa-spinner fa-spin ml-2"></i>}
                </button>
            </form>
        </div>
    );
}
