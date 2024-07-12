"use client";
import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import postService from "../../../services/postService/postService,";
import moment from "moment";
import parse from "html-react-parser";
import { TbThumbUp, TbThumbDown } from "react-icons/tb";
import { Spinner } from "flowbite-react";

const Article = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchPost();
  }, [slug, fetchPost]);

  if (pending) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner" size="lg" />
        </div>
      </div>
    );
  }

  console.log(article);

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
              <button type="button" title="I Like This Post">
                <TbThumbUp size={40} />
              </button>
              <button
                type="button"
                title="I Dislike This Post"
                className="pt-2"
              >
                <TbThumbDown size={40} />
              </button>
            </div>

            <div className="comment-section pb-32">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-6 dark:text-white">
                Discussion (20)
              </h2>
              <div className="add-comment">
                <form>
                  <div className="px-4 py-2 mb-4 border rounded-lg border-gray-100 bg-white rounded-t-lg dark:bg-gray-800">
                    <label htmlFor="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment"
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
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Article;
