"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
  password_confirmation: string;
};

const fields = [
  {
    id: 1,
    type: "email",
    name: "email",
    label: "Email address",
  },
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

const ResetPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Reset Password
            </h1>
          </div>

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
                        {...register(field.name as keyof FormValues, {
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
                          errors[field.name as keyof FormValues]
                            ? "border-red-500 focus:outline-none focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                        } dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400`}
                      />
                      {errors[field.name as keyof FormValues] && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors[field.name as keyof FormValues]?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={!isDirty || !isValid}
                >
                  Reset Password
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
