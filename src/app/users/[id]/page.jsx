"use client";
import React, { useEffect, useCallback, useState } from "react";
import userService from "../../../services/userService/userService";
import axiosInstance from "../../../services/axiosInstance";
import { connect } from "react-redux";
import { useParams } from "next/navigation";
import { Avatar, Spinner } from "flowbite-react";
import Posts from "../../../components/Posts/Posts";

const User = ({ access_token }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  console.log(posts);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  const fetchUser = useCallback(async () => {
    setPending(true);
    setDefaultHeaders(access_token);
    const results = await userService.getUser(id);

    if (results?.code === "ERR_NETWORK") {
      setPending(false);
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setPending(false);
      setUser(results.data.user);
      setPosts(results.data.posts);
      console.log(results.data.posts.posts);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setPending(false);
      setError(results.response.message);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
        <div className="flex items-center gap-2 px-8">
          <div>
            <Avatar
              alt="User"
              img={
                user?.profile.avatar === null
                  ? ""
                  : `http://localhost:8000/images/avatars/${user?.profile.avatar}`
              }
              rounded
              size="xl"
              className="mr-2 text-sm font-semibold"
            />
          </div>
          <div>
            <p className="text-3xl font-bold">{user?.name}</p>
            <p>
              @{user?.profile.username}
              <span className="px-1 text-gray-500">&#8226;</span>
              11 followers
              <span className="px-1 text-gray-500">&#8226;</span>
              {user?.posts_count} posts
            </p>
            <p>{user?.profile.about}</p>
          </div>
        </div>

        <div className="mt-24">
          <Posts posts={posts} />
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
  };
};

export default connect(mapStateToProps)(User);
