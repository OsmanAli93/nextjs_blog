import React from "react";

const Loader = () => {
  return (
    <div class="flex justify-center items-center h-screen">
      <div class="rounded-md h-12 w-12 border-4 border-t-4 border-teal-500 animate-spin absolute"></div>
    </div>
  );
};

export default Loader;
