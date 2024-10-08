"use client";
import Link from "next/link";
import React, { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import authService from "../../../services/authService/authService";
import Spinner from "../../../components/Spinner/Spinner";

const ForgotPassword = ({ access_token, user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onChange" });

  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const emailValidationRule = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  };

  useLayoutEffect(() => {
    if (access_token && user) {
      return router.push("/");
    }
  }, []);

  const onSubmit = async (data) => {
    setPending(true);
    const results = await authService.forgotPassword(data);

    console.log(results);

    if (results?.code === "ERR_NETWORK") {
      setError(results.message);
      setPending(false);
    }

    if (results?.status >= 200 && results.status < 400) {
      setSuccess(results.data.message);
      setPending(false);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setError(results.data.message);
      setPending(false);
    }

    // Add your form submission logic here
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Remember your password?
              <Link
                className="text-teal-600 decoration-2 hover:underline font-medium dark:text-teal-500 ps-1"
                href="/auth/login"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                {success && <p className="text-sm text-green-500">{success}</p>}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "Email address is required!",
                        pattern: emailValidationRule,
                      })}
                      className={`py-3 px-4 block w-full rounded-lg text-sm border ${
                        errors.email
                          ? "border-red-500 focus:outline-none focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                      } dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400`}
                      required
                      aria-describedby="email-error"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isDirty || !isValid || pending}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {pending ? (
                    <Spinner color="teal" />
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(ForgotPassword);
