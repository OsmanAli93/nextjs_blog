"use client";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import Posts from "../components/Posts/Posts";
import Toast from "../components/Toast/Toast";
import { useSearchParams } from "next/navigation";
import { GET_USER } from "../constants";
import axiosInstance from "../services/axiosInstance";
import postService from "../services/postService/postService,";
import { Spinner } from "flowbite-react";

const Home = ({ access_token, success, error, user, getUser }) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("verified");

  const [posts, setPosts] = useState([]);
  const [errorPosts, setErrorPosts] = useState("");
  const [pending, setPending] = useState(false);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  console.log("home", posts);

  const fetchPosts = useCallback(async () => {
    setPending(true);
    const results = await postService.posts();

    if (results?.code === "ERR_NETWORK") {
      setPending(false);
      setErrorPosts(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setPending(false);
      setPosts(results.data.posts);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setPending(false);
      setErrorPosts(results.response.data.message);
    }
  }, []);

  useEffect(() => {
    if (search) {
      setDefaultHeaders(access_token);
      getUser();
    }

    fetchPosts();
  }, [fetchPosts]);

  console.log(posts);

  if (pending) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner" size="lg" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-[90px]">
      <div className="container">
        <Posts posts={posts} />
      </div>

      {success !== "" && <Toast success={true} message={success} />}
      {error !== "" && <Toast error={true} message={error} />}
      {search && user?.email_verified_at && (
        <Toast success={true} message="Email successfully verified" />
      )}
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
    success: state.auth.successMessage || state.post.successMessage,
    error: state.auth.errorMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch({ type: GET_USER }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
