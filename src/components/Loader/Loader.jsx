import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-md h-12 w-12 border-4 border-t-4 border-teal-500 animate-spin absolute"></div>
    </div>
  );
};

export default Loader;
