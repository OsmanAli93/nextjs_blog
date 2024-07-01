"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import authService from "../../../services/authService/authService";
import Spinner from "../../../components/Spinner/Spinner";

const fields = [
  // {
  //   id: 1,
  //   type: "email",
  //   name: "email",
  //   label: "Email address",
  // },
  {
    id: 2,
    type: "password",
    name: "password",
    label: "Password",
  },
  {
    id: 3,
    type: "password",
    name: "password_confirmation",
    label: "Confirm Password",
  },
];

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onChange" });

  const search = useSearchParams();
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  const onSubmit = async (data) => {
    const token = search?.get("token");
    const email = search?.get("email");

    console.log(token);

    setPending(true);

    const results = await authService.resetPassword({
      ...data,
      token,
      email,
    });

    if (results?.code === "ERR_NETWORK") {
      setError(results.message);
      setPending(false);
    }

    if (results?.status >= 200 && results.status < 400) {
      setSuccess(results.data.message);
      setPending(false);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      console.log(results);
      setError(results.message);
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Reset Password
            </h1>
          </div>

          {success && <p className="text-sm text-green-600 mt-4">{success}</p>}
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                {fields.map((field) => (
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
                                  message: "Please enter a valid email address",
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
                ))}

                <button
                  type="submit"
                  className="w-full py-3 px-4 mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={!isDirty || !isValid || pending}
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

export default ResetPassword;
