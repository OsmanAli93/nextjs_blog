"use client";
import React, { useState, useLayoutEffect } from "react";
import emailVerificationService from "../../../services/emailVerificationService/emailVerificationService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";
import axiosInstance from "../../../services/axiosInstance";
import Toast from "../../../components/Toast/Toast";

const EmailVerify = ({ access_token, user, success, error }) => {
  const [pending, setPending] = useState(false);
  const [emailResent, setEmailResent] = useState("");
  const [emailNotResent, setEmailNotResent] = useState("");

  const router = useRouter();

  useLayoutEffect(() => {
    if (!access_token && !user) {
      return router.push("/");
    }

    if (user?.email_verified_at !== null) {
      return router.push("/");
    }
  }, [user]);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  console.log(user);

  return (
    <section className="h-screen">
      <div className="container-fluid px-4 h-full flex flex-col gap-y-4 items-center justify-center">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-20"
          alt="Flowbite React Logo"
        />
        <div className="max-w-md bg-white shadow-md p-6 rounded">
          <p className="text-sm text-gray-600 leading-5 mb-4">
            Before continuing, could you verify your email address by clicking
            on the link we just emailed to you? if you didn't receive the email,
            we will gladly send you another.
          </p>

          {emailResent !== "" && (
            <p className="mb-4 text-sm text-green-500">{emailResent}</p>
          )}

          {emailNotResent !== "" && (
            <p className="mb-4 text-sm text-red-500">{emailNotResent}</p>
          )}

          <div className="flex justify-between items-center">
            <button
              className={`bg-teal-600 text-white py-2 px-4 rounded uppercase text-xs tracking-widest ${
                pending && "opacity-50 cursor-not-allowed"
              }`}
              disabled={pending}
              onClick={async () => {
                setPending(true);
                setDefaultHeaders(access_token);
                const results = await emailVerificationService.resend();

                if (results?.code === "ERR_NETWORK") {
                  setEmailNotResent(results.message);
                  setPending(false);
                }

                if (results?.status >= 200 && results.status < 400) {
                  setEmailResent(results.data.message);
                  setPending(false);
                }

                if (
                  results?.response?.status >= 400 &&
                  results?.response?.status < 600
                ) {
                  setEmailNotResent(results.data.message);
                  setPending(false);
                }
              }}
            >
              Resend Verification Email
            </button>
            <div className="flex gap-4">
              <Link href="/profile" className="text-sm text-gray-600 underline">
                Edit Profile
              </Link>
              <Link href="#" className="text-sm text-gray-600 underline">
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {success !== "" && <Toast success={true} message={success} />}
      {error !== "" && <Toast error={true} message={error} />}
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
    success: state.auth.successMessage,
    error: state.auth.errorMessage,
  };
};

export default connect(mapStateToProps)(EmailVerify);
