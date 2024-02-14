import React from "react";

const CustomButton = ({ onClick, children }) => {
  return (
    <button className="btn btn-primary btn-block" onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
