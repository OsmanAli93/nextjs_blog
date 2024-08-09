"use client";
import Link from "next/link";
import React, { useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import { LOADING, REGISTER_USER } from "../../../constants/index";
import Alert from "../../../components/Alert/Alert";
import Spinner from "../../../components/Spinner/Spinner";

const fields = [
  {
    id: 1,
    type: "text",
    name: "name",
    label: "Name",
  },
  {
    id: 2,
    type: "email",
    name: "email",
    label: "Email address",
  },
  {
    id: 3,
    type: "password",
    name: "password",
    label: "Password",
  },
  {
    id: 4,
    type: "password",
    name: "password_confirmation",
    label: "Confirm Password",
  },
  {
    id: 5,
    type: "checkbox",
    name: "terms",
    label: "I accept the Terms and Conditions",
  },
];

const Register = ({ loading, pending, error, addUser, access_token }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onChange" });

  const router = useRouter();

  const onSubmit = async (data) => {
    pending(true);
    addUser(data, router);
  };

  useLayoutEffect(() => {
    if (access_token) {
      router.push("/");
    }
  }, [access_token]);

  console.log(loading);

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign up
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?
              <Link
                className="text-teal-600 decoration-2 ps-1 hover:underline font-medium dark:text-teal-500"
                href="/auth/login"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
            >
              <svg
                className="w-4 h-auto"
                width="46"
                height="47"
                viewBox="0 0 46 47"
                fill="none"
              >
                <path
                  d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                  fill="#4285F4"
                />
                <path
                  d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                  fill="#34A853"
                />
                <path
                  d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                  fill="#FBBC05"
                />
                <path
                  d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                  fill="#EB4335"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>

            {error && <Alert color="danger" text={error} />}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                {fields.map((field) => {
                  return field.name === "terms" ? (
                    <div key={field.id} className="flex items-center">
                      <div className="flex">
                        <input
                          type={field.type}
                          id={field.name}
                          {...register(field.name, {
                            required:
                              "Please agree with the terms and conditions",
                          })}
                          className="shrink-0 mt-0.5 border-gray-200 rounded text-teal-600  dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-teal-500 dark:checked:border-teal-500 dark:focus:ring-offset-gray-800"
                        />
                      </div>
                      <div className="ms-3">
                        <label
                          htmlFor="remember-me"
                          className="text-sm dark:text-white"
                        >
                          I accept the{" "}
                          <a
                            className="text-teal-600 decoration-2 hover:underline font-medium dark:text-teal-500"
                            href="#"
                          >
                            Terms and Conditions
                          </a>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div key={field.id} className="">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium mb-2 dark:text-white"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type}
                          id={field.name}
                          {...register(field.name, {
                            required:
                              field.type !== "checkbox" &&
                              `${field.label} is required`,
                            minLength:
                              field.type === "password" &&
                              field.name === "password"
                                ? {
                                    value: 8,
                                    message:
                                      "Password must be at least 8 characters",
                                  }
                                : undefined,
                            validate:
                              field.name === "password_confirmation"
                                ? (value) =>
                                    value === watch("password") ||
                                    "Passwords do not match"
                                : undefined,
                            pattern:
                              field.type === "email"
                                ? {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:
                                      "Please enter a valid email address",
                                  }
                                : undefined,
                          })}
                          className={`py-3 px-4 block w-full rounded-lg text-sm border ${
                            errors[field.name]
                              ? "border-red-500 focus:outline-none focus:border-red-500 focus:ring-red-500"
                              : "border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                          } dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400`}
                        />
                        {errors[field.name] && (
                          <p className="text-sm text-red-600 mt-2">
                            {errors[field.name]?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={!isDirty || !isValid || loading}
                >
                  {loading ? <Spinner color="teal" /> : <span>Sign up</span>}
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
    loading: state.auth.loading,
    error: state.auth.errorMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (data, router) => dispatch({ type: REGISTER_USER, data, router }),
    pending: (payload) => dispatch({ type: LOADING, payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
