import React from "react";

const CustomButton = ({ type, child }) => {
  return (
    <button type={type} id="custom-btn" className="text-white btn w-100">
      {child}
    </button>
  );
};

export default CustomButton;
