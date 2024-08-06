import React from "react";

const LoadingBar = () => {
  return (
    <div className="relative h-1 w-full overflow-hidden bg-gray-200">
      <div className="loading-bar absolute left-0 h-full bg-indigo-700"></div>
    </div>
  );
};

export default LoadingBar;
