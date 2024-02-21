import React from "react";

const CustomInputBox = ({
  type,
  placeholder,
  name,
  onChange,
  value,
  isEmpty,
}) => {
  return (
    <input
      type={type}
      id="custom-input-box"
      className={`form-control mt-3 ${isEmpty ? "input-empty" : ""}`}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      value={value}
    />
  );
};

export default CustomInputBox;
