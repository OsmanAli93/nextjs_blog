import Link from "next/link";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { LOADING, UPDATE_POST } from "../../constants";
import { usePathname } from "next/navigation";
import Modal from "../Modal/Modal";
import Toast from "../Toast/Toast";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import axiosInstance from "../../services/axiosInstance";
import postService from "../../services/postService/postService,";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Post = ({ post, access_token, user, pending, updatePost }) => {
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const param = pathname.split("/")[2];

  const [open, setOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onDelete, setOnDelete] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      _method: "PATCH",
      title: post?.time,
      description: post?.description,
      message: post?.message,
    },
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const estimateReadingTimes = (post) => {
    const wordsPerMinute = 225;
    const words = post.message.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
  };

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  const onSubmit = (data) => {
    pending(true);
    setDefaultHeaders(access_token);
    updatePost(post?.id, data);
    setOpen(false);
  };

  const handleOnClose = () => {
    setOpen(false);
    setOnDelete(false);
    setOnEdit(false);
  };

  return (
    <>
      <article className="flex flex-col mb-12">
        <div className="h-[240px]">
          <Link href={`/posts/${post.slug}`}>
            <img
              src={`http://localhost:8000/images/thumbnails/${post.thumbnail}`}
              className="w-full h-full rounded"
              alt=""
            />
          </Link>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between py-4">
            <Link href={`/users/${post.user_id}`} className="flex items-center">
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={`http://localhost:8000/images/avatars/${post.user.profile.avatar}`}
                alt=""
              />
              <div className="text-sm text-gray-900 dark:text-white">
                <span>{post.user.name}</span>
              </div>
            </Link>

            <div className="text-sm">
              <span>{estimateReadingTimes(post)}</span>
              <span className="px-2 text-gray-500">&#8226;</span>
              <span className="text-sm text-gray-500">
                {moment(post.created_at).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </div>
        <h2 className="mb-3 text-xl font-bold text-gray-900 cutoff-text dark:text-white">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="mb-12 text-md font-normal text-gray-500 dark:text-gray-400 cutoff-text">
          {post.description}
        </p>
        <div className="text-end">
          {pathname.split("/")[1] === page && user?.id === Number(param) ? (
            <div className="flex justify-end items-center gap-2">
              <button
                type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm w-20 py-2.5 text-center"
                onClick={() => {
                  setOpen(true);
                  setOnDelete(true);
                  setOnEdit(false);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm w-20 py-2.5 text-center"
                onClick={() => {
                  setOpen(true);
                  setOnDelete(false);
                  setOnEdit(true);
                  console.log("post", post);
                }}
              >
                Edit
              </button>
            </div>
          ) : (
            <Link
              href={`/posts/${post.slug}`}
              className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Read More
            </Link>
          )}
        </div>
      </article>

      <Modal open={open} close={handleOnClose}>
        {onDelete && (
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only" onClick={() => handleOnClose()}>
                Close modal
              </span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Yes, I'm sure
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => handleOnClose()}
              >
                No, cancel
              </button>
            </div>
          </div>
        )}

        {onEdit && (
          <div
            className="relative p-4 w-full max-w-xl h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Post
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                  onClick={() => handleOnClose()}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form className="p-4 md:p-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Thumbnail
                    </label>
                    <input
                      type="file"
                      id="thumbnail"
                      {...register("thumbnail")}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register("title")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      defaultValue={post?.title}
                    />
                    <input type="hidden" {...register("_method")} />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      {...register("description")}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      defaultValue={post?.description}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Message
                    </label>

                    <ReactQuill
                      id="edit-message"
                      theme="snow"
                      // value={editorContent}
                      defaultValue={post?.message}
                      modules={modules}
                      onChange={(value) => setValue("message", value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center d"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Edit Post
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
    loading: state.post.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePost: (id, data) => dispatch({ type: UPDATE_POST, id, data }),
    pending: (payload) => dispatch({ type: LOADING, payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
