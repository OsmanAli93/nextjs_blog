import Link from "next/link";
import React from "react";
import moment from "moment";

const Post = ({ post }) => {
  const estimateReadingTimes = (post) => {
    const wordsPerMinute = 225;
    const words = post.message.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
  };

  return (
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
        <Link
          href={`/posts/${post.slug}`}
          className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

export default Post;
