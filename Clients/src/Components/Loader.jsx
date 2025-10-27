import React from "react";
import "./Loader.css"; // custom CSS for blur

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner-border text-light" role="status"></div>
    </div>
  );
};

export default Loader;
