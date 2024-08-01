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
        <div>
          <div className="w-full h-[160px] bg-white rounded-lg"></div>
          <div className="flex items-center justify-center -mt-10">
            <div className="text-center">
              <Avatar
                alt="User settings"
                img={
                  user?.profile?.avatar === null
                    ? ""
                    : `http://localhost:8000/images/avatars/${user.profile.avatar}`
                }
                rounded
                bordered
                color="light"
                size="lg"
              />
              <h4 className="text-lg font-bold mt-2">{user?.name}</h4>
              <div className="text-gray-600 mb-2">{user?.profile.city}</div>
              <button className="text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 font-medium rounded-full text-sm px-8 py-2 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800">
                Follow
              </button>
            </div>
          </div>
          <div className="max-w-lg mx-auto flex items-center text-center mt-6">
            <div className="flex-1">
              <h4 className="font-bold">Followers</h4>
              <p>2.1K</p>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Posts</h4>
              <p>2.1K</p>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Likes</h4>
              <p>2.1K</p>
            </div>
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
