import React from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Pagination = ({ posts, onPageChange, currentPage }) => {
  const showNextButton = currentPage !== posts.last_page;
  const showPrevButton = currentPage !== 1;

  return (
    <div>
      <ReactPaginate
        breakLabel={<span className="mr-4">...</span>}
        nextLabel={
          showNextButton && (
            <span className="text-white w-10 h-10 flex items-center justify-center bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br rounded-md mr-4">
              <BsChevronRight />
            </span>
          )
        }
        pageRangeDisplayed={3}
        pageCount={Math.ceil(posts.total / posts.per_page)}
        previousLabel={
          showPrevButton && (
            <span className="text-white w-10 h-10 flex items-center justify-center bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br rounded-md mr-4">
              <BsChevronLeft />
            </span>
          )
        }
        renderOnZeroPageCount={null}
        containerClassName="flex items-center justify-center mt-24"
        pageClassName="block border-solid border-lightGray hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-md mr-4"
        activeClassName="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br"
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Pagination;
