"use client";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, FileInput, Label, TextInput, Alert } from "flowbite-react";
import { CREATE_POST, LOADING } from "../../constants/index";
import axiosInstance from "../../services/axiosInstance";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Link from "next/link";

const Post = ({ access_token, user, create, pending, error }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({ mode: "onChange" });

  const router = useRouter();

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

  useLayoutEffect(() => {
    if (!user && !access_token) {
      redirect.push("/auth/login");
    }
  }, [user]);

  useEffect(() => {
    register("message", { required: "Message is required!" });
  }, [register]);

  const editorContent = watch("message");

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  const onSubmit = (data) => {
    const content = {
      thumbnail: data.thumbnail[0],
      title: data.title,
      description: data.description,
      message: data.message,
    };

    setDefaultHeaders(access_token);
    create(content, router);

    console.log(data);
  };

  return (
    <section className="py-[90px]">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
          <form
            className="p-6"
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form"
          >
            <h2 className="text-xl font-semibold leading-7 mb-6 text-gray-900">
              Write An Article
            </h2>

            {!user?.email_verified_at && (
              <div
                id="alert-4"
                class="flex items-center p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
                role="alert"
              >
                <svg
                  class="flex-shrink-0 w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">Info</span>
                <div class="ms-3 text-sm font-medium">
                  Before you are allowed to create an article, you must ensure
                  your email is verified first
                  <Link
                    href="/email/verify"
                    class="font-semibold underline hover:no-underline ml-2"
                  >
                    verify email here
                  </Link>
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="thumbnail" value="Thumbnail" />
              </div>
              <FileInput
                id="thumbnail"
                {...register("thumbnail", {
                  required: "Thumbnail is required!",
                })}
              />

              {errors.thumbnail && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.thumbnail?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                {...register("title", {
                  required: "Title is required!",
                })}
                type="text"
                placeholder="Post Title"
                shadow
              />

              {errors.title && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.title?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <TextInput
                id="description"
                {...register("description", {
                  required: "Description is required!",
                })}
                type="text"
                placeholder="A Brief Of Description About This Post"
                shadow
              />

              {errors.description && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.description?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="message" value="Message" />
              </div>
              <ReactQuill
                id="message"
                theme="snow"
                value={editorContent}
                modules={modules}
                onChange={(value) => setValue("message", value)}
              />

              {errors.message && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.message?.message}
                </p>
              )}
            </div>

            <div className="mb-4 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none"
                disabled={
                  !isDirty || !isValid || user?.email_verified_at === null
                }
              >
                {pending ? <Spinner color="teal" /> : <span>Submit</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
    error: state.post.errorMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    create: (data, router) => dispatch({ type: CREATE_POST, data, router }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
