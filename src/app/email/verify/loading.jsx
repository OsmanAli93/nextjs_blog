import React from "react";
import { Spinner } from "flowbite-react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner" size="lg" />
      </div>
    </div>
  );
};

export default Loading;
