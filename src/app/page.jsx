"use client";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import Posts from "../components/Posts/Posts";
import Toast from "../components/Toast/Toast";
import { useSearchParams } from "next/navigation";
import { GET_USER } from "../constants";
import axiosInstance from "../services/axiosInstance";

const Home = ({ access_token, success, error, user, getUser }) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("verified");

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  useEffect(() => {
    if (search) {
      setDefaultHeaders(access_token);
      getUser();
    }
  }, []);

  console.log(search);

  return (
    <section className="py-[90px]">
      <div className="container">
        <Posts />
      </div>

      {success !== "" && <Toast success={true} message={success} />}
      {error !== "" && <Toast error={true} message={error} />}
      {search && user.email_verified_at && (
        <Toast success={true} message="Email successfully verified" />
      )}
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

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch({ type: GET_USER }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
