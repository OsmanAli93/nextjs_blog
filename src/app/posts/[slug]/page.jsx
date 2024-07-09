"use client";
import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import postService from "../../../services/postService/postService,";
import moment from "moment";
import parse from "html-react-parser";
import { TbThumbUp, TbThumbDown } from "react-icons/tb";

const Article = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  const fetchPost = useCallback(async () => {
    const results = await postService.post(slug);

    if (results?.code === "ERR_NETWORK") {
      setError(results.message);
    }

    if (results?.status >= 200 && results.status < 400) {
      setArticle(results.data.post);
    }

    if (results?.response?.status >= 400 && results?.response?.status < 600) {
      setError(results.response.message);
    }
  }, []);

  useEffect(() => {
    fetchPost();
  }, [slug, fetchPost]);

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
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
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

            <div className="comment-section">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-6 dark:text-white">
                Discussion (20)
              </h2>
              <div className="add-comment">
                <form>
                  <div class="px-4 py-2 mb-4 border rounded-lg border-gray-100 bg-white rounded-t-lg dark:bg-gray-800">
                    <label for="comment" class="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                      placeholder="Write a comment..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-teal-600 rounded-lg focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-900 hover:bg-teal-800"
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
