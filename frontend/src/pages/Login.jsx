// Login page: Email, Password.
// Formik manages the form; Yup validates it.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../validation/schemas";
import TextField from "../components/TextField";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        const res = await api.post("/auth/login", values);
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      } catch (err) {
        setServerError(err.response?.data?.message || "Something went wrong.");
      }
    },
  });

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Welcome back</h2>

        {serverError && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">{serverError}</p>
        )}

        <TextField
          label="Email"
          name="email"
          type="email"
          formik={formik}
          placeholder="john@example.com"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          formik={formik}
          placeholder="Your password"
        />

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-2 w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
