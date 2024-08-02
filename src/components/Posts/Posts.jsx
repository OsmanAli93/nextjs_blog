import React from "react";
import Post from "./Post";
import Pagination from "../Pagination/Pagination";

const Posts = ({ posts, handlePageClick, currentPage }) => {
  console.log(posts);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {posts.data?.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
      </div>
      {posts?.last_page !== 1 && (
        <Pagination
          posts={posts}
          onPageChange={handlePageClick}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default Posts;
