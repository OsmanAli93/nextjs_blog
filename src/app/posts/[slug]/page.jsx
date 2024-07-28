"use client";
import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import postService from "../../../services/postService/postService,";
import commentService from "../../../services/commentService/commentService";
import axiosInstance from "../../../services/axiosInstance";
import moment from "moment";
import { connect } from "react-redux";
import parse from "html-react-parser";
import {
  TbThumbUp,
  TbThumbDown,
  TbThumbUpFilled,
  TbThumbDownFilled,
} from "react-icons/tb";
import { Spinner } from "flowbite-react";
import Toast from "../../../components/Toast/Toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import format from "date-fns/format";

const Article = ({ access_token, user }) => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [pending, setPending] = useState(false);
  const [onComment, setOnComment] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchPost = useCallback(async () => {
    setPending(true);
    const results = await postService.post(slug);

    if (results?.code === "ERR_NETWORK") {
      setPending(false);
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setPending(false);
      setArticle(results.data.post);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setPending(false);
      setError(results.response.message);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    setPending(true);
    const results = await commentService.fetch(slug);

    if (results?.code === "ERR_NETWORK") {
      setPending(false);
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setPending(false);
      setComments(results.data.comments);
      console.log(results);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setPending(false);
      setError(results.response.message);
    }
  }, []);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  const handleLike = async () => {
    setDefaultHeaders(access_token);
    const result = await postService.like(slug);

    setArticle(result.data.post);

    console.log(result);
  };

  const handleUnlike = async () => {
    setDefaultHeaders(access_token);
    const result = await postService.unlike(slug);

    setArticle(result.data.post);

    console.log(result);
  };

  const onSubmit = async (data) => {
    setDefaultHeaders(access_token);
    setOnComment(true);
    const results = await commentService.create(slug, {
      user_id: user.id,
      parent_id: null,
      comment: data.comment,
    });

    reset();

    if (results?.code === "ERR_NETWORK") {
      setOnComment(false);
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setOnComment(false);
      setSuccess(results.data.message);
      console.log(results);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setOnComment(false);
      setError(results.response.message);
    }

    console.log(data.comment);
  };

  const likedByUser = article?.likes?.find((like) => like.user_id === user?.id);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [slug, fetchPost, fetchComments]);

  console.log(comments);

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
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-4xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <header className="mb-4 lg:mb-6 not-format">
              <div className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <img
                    className="mr-4 w-16 h-16 rounded-full"
                    src={`http://127.0.0.1:8000/images/avatars/${article?.user.profile.avatar}`}
                    alt={article?.user.profile.first_name}
                  />

                  <div>
                    <a
                      href="#"
                      rel="author"
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                      {article?.user.name}
                    </a>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      {article?.user.profile.about}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      <span>
                        {moment(article?.created_at).format("MMM DD, YYYY")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <h1 className="mt-6 text-3xl font-extrabold leading-relaxed text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              {article?.title}
            </h1>
            <p className="lead mb-6">{article?.description}</p>
            <div id="single-article" className="body">
              {parse(`${article?.message}`)}
            </div>

            <div className="flex items-center gap-6 mb-12">
              {access_token == null && user === null ? (
                <>
                  <div>
                    <Link
                      href="/auth/login"
                      className="flex items-center"
                      title="I Like This Post"
                    >
                      <TbThumbUp size={40} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {likedByUser ? (
                    <div>
                      <button
                        type="button"
                        className="flex items-center"
                        title="I Like This Post"
                        onClick={() => handleUnlike()}
                      >
                        <TbThumbUpFilled size={40} />
                        {article?.likes?.length > 0 && (
                          <span className="text-sm pl-1">
                            {article.likes.length}
                          </span>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        title="I Like This Post"
                        onClick={() => handleLike()}
                      >
                        <TbThumbUp size={40} />
                      </button>
                    </div>
                  )}
                </>
              )}

              <button
                type="button"
                title="I Dislike This Post"
                className="pt-1"
              >
                <TbThumbDown size={40} />
              </button>
            </div>

            <div className="comment-section pb-32">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-6 dark:text-white">
                Discussion (20)
              </h2>
              {onComment ? (
                <div className="w-full flex justify-center items-center">
                  <div className="text-center">
                    <Spinner aria-label="Center-aligned spinner" size="lg" />
                  </div>
                </div>
              ) : (
                <div className="add-comment">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-4 py-2 mb-4 border rounded-lg border-gray-100 bg-white rounded-t-lg dark:bg-gray-800">
                      <label htmlFor="comment" className="sr-only">
                        Your comment
                      </label>
                      <textarea
                        id="comment"
                        {...register("comment", {
                          required: "This comment field is required",
                        })}
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                        placeholder="Write a comment..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Post comment
                    </button>
                  </form>
                </div>
              )}

              <div className="comments">
                {comments?.data?.length > 0 &&
                  comments.data.map((comment) => (
                    <div key={comment.id} className="my-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <p className="flex items-center mr-2 text-sm font-semibold">
                            <img
                              className="mr-2 w-6 h-6 rounded-full"
                              src={`http://localhost:8000/images/avatars/${comment.user.profile.avatar}`}
                            />
                            {comment.user.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {format(comment.created_at, "MMM. d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div>{comment.comment}</div>
                      <div className="mt-4">
                        <button className="font-medium text-sm text-gray-500">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </article>
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
  };
};

export default connect(mapStateToProps)(Article);
