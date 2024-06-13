"use client";
import React from "react";

const Alert = ({ color, text }) => {
  const variant = {
    dark: "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-800/10 dark:border-gray-900 dark:text-gray-500",
    secondary:
      "bg-gray-50 border-gray-200 text-gray-600 dark:bg-white/10 dark:border-white/10 dark:text-neutral-400",
    info: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-800/10 dark:border-blue-900 dark:text-blue-500",
    success:
      "bg-teal-100 border-teal-200 text-teal-800 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500",
    danger:
      "bg-red-100 border-red-200 text-red-800 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500",
    warning:
      "bg-yellow-100  border-yellow-200 text-yellow-800 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500",
  };

  return (
    <div
      class={`${variant[color]} my-2 text-center border  text-sm rounded-lg p-4`}
      role="alert"
    >
      {text}
    </div>
  );
};

export default Alert;
