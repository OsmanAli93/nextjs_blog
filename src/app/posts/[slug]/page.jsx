"use client";
import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  Fragment,
} from "react";
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
import { Avatar, Spinner } from "flowbite-react";
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
  const [value, setValue] = useState("");

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
      setComments(results.data.comments.comments);
      console.log("result", results);
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
  };

  const handleUnlike = async () => {
    setDefaultHeaders(access_token);
    const result = await postService.unlike(slug);

    setArticle(result.data.post);
  };

  const onSubmit = async (data) => {
    setDefaultHeaders(access_token);
    setOnComment(true);
    const results = await commentService.create(slug, {
      user_id: user.id,
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
      setComments(results.data.comments.comments);
      console.log(results);
    }
    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setOnComment(false);
      setError(results.response.message);
    }
  };

  const onSubmitReply = async (data) => {
    setDefaultHeaders(access_token);
    setOnComment(true);

    const results = await commentService.create(slug, data);

    if (results?.code === "ERR_NETWORK") {
      setOnComment(false);
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setOnComment(false);
      setSuccess(results.data.message);
      setComments(results.data.comments.comments);
      console.log(results);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setOnComment(false);
      setError(results.response.message);
    }
  };

  const Comment = ({ comment }) => {
    const [isReply, setIsReply] = useState(false);
    const inputRef = useRef(null);

    return (
      <div className="my-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Avatar
              alt="User"
              img={
                comment?.user.profile.avatar === null
                  ? ""
                  : `http://localhost:8000/images/avatars/${comment.user.profile.avatar}`
              }
              rounded
              className="mr-2 text-sm font-semibold"
            />
            {comment.user.name}

            <p className="text-gray-600 text-sm">
              {format(comment.created_at, "MMM. d, yyyy")}
            </p>
          </div>
        </div>
        <div>{comment.comment}</div>
        <div className="mt-4">
          <button
            className="font-medium text-sm text-gray-500"
            onClick={() => setIsReply(!isReply)}
          >
            Reply
          </button>
        </div>

        {isReply && (
          <div className="add-reply mt-2">
            <div className="px-4 py-2 mb-4 border rounded-lg border-gray-100 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Your reply
              </label>
              <textarea
                name={comment.id}
                rows="4"
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a reply..."
                ref={inputRef}
              ></textarea>
            </div>
            <div>
              <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => {
                  const data = {
                    user_id: user.id,
                    comment: inputRef.current.value,
                  };

                  onSubmitReply(data);
                  inputRef.current.value = "";
                }}
              >
                Post reply
              </button>
              <button
                type="button"
                className="font-medium text-sm text-gray-500"
                onClick={() => {
                  setIsReply(false);
                  inputRef.current.value = "";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {comment.replies &&
          comment.replies.length > 0 &&
          comment.replies.map((reply) => (
            <Fragment key={reply.id}>
              <Replies key={reply.id} reply={reply} parent_id={comment.id} />
            </Fragment>
          ))}
      </div>
    );
  };

  const Replies = ({ reply, parent_id }) => {
    const [isReply, setIsReply] = useState(false);
    const inputRef = useRef(null);

    return (
      <>
        <div key={reply.id} className="my-6 mx-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Avatar
                alt="User"
                img={
                  reply?.user.profile.avatar === null
                    ? ""
                    : `http://localhost:8000/images/avatars/${reply.user.profile.avatar}`
                }
                rounded
                className="mr-2 text-sm font-semibold"
              />
              {reply.user.name}

              <p className="text-gray-600 text-sm">
                {format(reply.created_at, "MMM. d, yyyy")}
              </p>
            </div>
          </div>
          <div className="py-2">{reply.comment}</div>
          <div className="mb-6">
            <button
              className="font-medium text-sm text-gray-500"
              onClick={() => setIsReply(!isReply)}
            >
              Reply
            </button>
          </div>

          {isReply && (
            <>
              <div className="add-reply">
                <div className="px-4 py-2 mb-4 border rounded-lg border-gray-100 bg-white rounded-t-lg dark:bg-gray-800">
                  <label htmlFor="comment" className="sr-only">
                    Your reply
                  </label>
                  <textarea
                    name={reply.id}
                    rows="4"
                    className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                    placeholder="Write a reply..."
                    ref={inputRef}
                  ></textarea>
                </div>
                <div>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    onClick={() => {
                      const data = {
                        user_id: user.id,
                        parent_id: parent_id,
                        comment: inputRef.current.value,
                      };

                      onSubmitReply(data);
                      inputRef.current.value = "";
                    }}
                  >
                    Post reply
                  </button>
                  <button
                    type="button"
                    className="font-medium text-sm text-gray-500"
                    onClick={() => {
                      setIsReply(false);
                      inputRef.current.value = "";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {reply.replies &&
          reply.replies.length > 0 &&
          reply.replies.map((reply) => (
            <Fragment key={reply.id}>
              <Replies reply={reply} parent_id={parent_id} />
            </Fragment>
          ))}
      </>
    );
  };

  const likedByUser = article?.likes?.find((like) => like.user_id === user?.id);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [slug, fetchPost, fetchComments]);

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
                Discussion ({comments?.length})
              </h2>
              {onComment ? (
                <div className="w-full flex justify-center items-center">
                  <div className="text-center">
                    <Spinner aria-label="Center-aligned spinner" size="lg" />
                  </div>
                </div>
              ) : (
                <div className="add-comment">
                  <form key={1} onSubmit={handleSubmit(onSubmit)}>
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
                {comments?.length > 0 &&
                  comments.map((comment, index) => (
                    <Fragment key={index}>
                      <Comment comment={comment} />
                    </Fragment>
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
