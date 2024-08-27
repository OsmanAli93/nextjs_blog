"use client";
import React, { useEffect, useCallback, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import userService from "../../../services/userService/userService";
import followService from "../../../services/followService/followService";
import { connect } from "react-redux";
import { useParams } from "next/navigation";
import { Avatar, Spinner } from "flowbite-react";
import Toast from "../../../components/Toast/Toast";
import Posts from "../../../components/Posts/Posts";

const User = ({ user, access_token, success, editPosts }) => {
  const { id } = useParams();
  const [pageUser, setPageUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [pending, setPending] = useState(false);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  const fetchUserPosts = useCallback(async () => {
    setPending(true);

    const results = await userService.getUserPosts(id);

    if (results?.code === "ERR_NETWORK") {
      setPending(false);
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setPending(false);
      setPageUser(results.data.user);
      setPosts(results.data.posts);
      setFollowers(results.data.followers);
      setFollowersCount(results.data.followers_count);
      setFollowingCount(results.data.following_count);
      console.log(results);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setPending(false);
      setError(results.response.message);
    }
  }, []);

  const isFollower = !!followers?.find((follower) => follower.id === user.id);

  useEffect(() => {
    if (editPosts.length > 0) {
      setPosts(editPosts);
    }

    fetchUserPosts();
  }, [fetchUserPosts, editPosts, followersCount]);

  // if (pending) {
  //   return (
  //     <div className="h-screen w-full flex justify-center items-center">
  //       <div className="text-center">
  //         <Spinner aria-label="Center-aligned spinner" size="lg" />
  //       </div>
  //     </div>
  //   );
  // }
  console.log(user.id, +id);

  return (
    <section className="py-[90px]">
      <div className="container">
        <div>
          {pageUser?.profile.background_image !== null ? (
            <div
              style={{
                background: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundImage: `url(http://localhost:8000/images/backgrounds/${pageUser?.profile.background_image})`,
              }}
              className="w-full h-[200px] rounded-lg"
            ></div>
          ) : (
            <div className="w-full h-[160px] bg-white rounded-lg"></div>
          )}

          <div className="flex items-center justify-center -mt-10">
            <div className="text-center">
              <Avatar
                alt="User settings"
                img={
                  pageUser?.profile?.avatar === null
                    ? ""
                    : `http://localhost:8000/images/avatars/${pageUser?.profile.avatar}`
                }
                rounded
                bordered
                color="light"
                size="lg"
              />
              <h4 className="text-lg font-bold mt-2">{pageUser?.name}</h4>
              <div className="text-gray-600 mb-2">{pageUser?.profile.city}</div>

              {user.id !== +id && (
                <>
                  {isFollower ? (
                    <button
                      className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300  font-medium rounded-full text-sm px-8 py-2 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700"
                      onClick={async () => {
                        setDefaultHeaders(access_token);
                        const results = await followService.unfollow({
                          id,
                        });

                        if (results?.code === "ERR_NETWORK") {
                          console.log(results);
                        }

                        if (results?.status >= 200 && results.status < 400) {
                          setFollowersCount(results.data.followers_count);
                        }

                        if (
                          results?.response?.status >= 400 &&
                          results?.response?.status < 600
                        ) {
                          console.log(results);
                        }
                      }}
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300  font-medium rounded-full text-sm px-8 py-2 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700"
                      onClick={async () => {
                        setDefaultHeaders(access_token);
                        const results = await followService.follow({
                          id,
                        });

                        if (results?.code === "ERR_NETWORK") {
                          console.log(results);
                        }

                        if (results?.status >= 200 && results.status < 400) {
                          setFollowersCount(results.data.followers_count);
                          console.log(results);
                        }

                        if (
                          results?.response?.status >= 400 &&
                          results?.response?.status < 600
                        ) {
                          console.log(results);
                        }
                      }}
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="max-w-lg mx-auto flex items-center text-center mt-6">
            <div className="flex-1">
              <h4 className="font-bold">Followers</h4>
              <p>{followersCount}</p>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Following</h4>
              <p>{followingCount}</p>
            </div>
            <div className="flex-1">
              <h4 className="font-bold">Posts</h4>
              <p>{posts?.total}</p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <Posts posts={posts} />
        </div>
      </div>

      {success !== "" && <Toast success={true} message={success} />}
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
    success: state.post.successMessage,
    editPosts: state.post.posts,
  };
};

export default connect(mapStateToProps)(User);
