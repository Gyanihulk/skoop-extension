import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CustomPasswordInputBox = ({
  placeholder,
  name,
  onChange,
  value,
  isEmpty,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="position-relative custom-password-input-box">
      <input
        type={showPassword ? "text" : "password"}
        className={`form-control mt-3 ${isEmpty ? "input-empty" : ""}`}
        id="custom-password-input-box"
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
      />
      <button
        className="btn position-absolute end-0 top-50 translate-middle-y border-0"
        type="button"
        onClick={handleTogglePassword}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default CustomPasswordInputBox;
