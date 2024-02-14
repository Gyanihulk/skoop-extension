import React from "react";

const CustomInputBox = ({ type, placeholder, name }) => {
  return (
    <input
      type={type}
      id="custom-input"
      className="form-control py-2"
      placeholder={placeholder}
      name={name}
    />
  );
};

export default CustomInputBox;
