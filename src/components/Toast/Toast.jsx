import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RESET_SUCCESS_MESSAGE, RESET_FAILED_MESSAGE } from "../../constants";

const Toast = ({
  success,
  error,
  message,
  resetSuccessMessage,
  resetFailedMesssage,
}) => {
  const [show, setShow] = useState(success || error);

  useEffect(() => {
    let timeout;

    if (success) {
      timeout = setTimeout(() => {
        setShow(false);
        resetSuccessMessage();
      }, 3000);
    }

    if (error) {
      timeout = setTimeout(() => {
        setShow(false);
        resetFailedMesssage();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      id="toast-simple"
      className={`${
        show ? "block" : "hidden"
      } flex items-center w-full fixed bottom-[50px] right-[50px]  max-w-xs p-4 space-x-4 transistion-all text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
  role="alert`}
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${
          success
            ? "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200"
            : "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200"
        }  rounded-lg  `}
      >
        {success && (
          <>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </>
        )}

        {error && (
          <>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
            <span class="sr-only">Error icon</span>
          </>
        )}
      </div>

      <div className="pl-4 text-sm font-normal">{message}</div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetSuccessMessage: () => dispatch({ type: RESET_SUCCESS_MESSAGE }),
    resetFailedMesssage: () => dispatch({ type: RESET_FAILED_MESSAGE }),
  };
};

export default connect(null, mapDispatchToProps)(Toast);
