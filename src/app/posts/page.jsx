"use client";
import React, { useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, FileInput, Label, TextInput } from "flowbite-react";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Post = ({ access_token, user }) => {
  const [value, setValue] = useState("");
  const {
    register,
    handleSubmit,
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

  const onSubmit = (data) => {
    console.log({
      ...data,
      value,
    });
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
              <FileInput id="thumbnail" {...register("thumbnail")} />
            </div>

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                {...register("title")}
                type="text"
                placeholder="Post Title"
                required
                shadow
              />
            </div>

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <TextInput
                id="description"
                {...register("description")}
                type="text"
                placeholder="A Brief Of Description About This Post"
                required
                shadow
              />
            </div>

            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="message" value="Message" />
              </div>
              <ReactQuill
                id="message"
                theme="snow"
                value={value}
                modules={modules}
                onChange={setValue}
              />
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
