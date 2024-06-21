"use client";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, FileInput, Label, TextInput } from "flowbite-react";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Post = ({ access_token, user }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm();

  const redirect = useRouter();

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

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section className="py-[90px]">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold leading-7 mb-6 text-gray-900">
              Write An Article
            </h2>

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
              <Button type="submit">Submit</Button>
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
  };
};

export default connect(mapStateToProps)(Post);
