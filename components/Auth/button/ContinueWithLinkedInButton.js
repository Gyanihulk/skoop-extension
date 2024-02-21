import React, { useContext } from "react";
import { FaLinkedinIn } from "react-icons/fa6";
import AuthContext from "../../../contexts/AuthContext";

const ContinueWithLinkedInButton = () => {
  const { handleSocialLogin } = useContext(AuthContext);
  return (
    <button
      className="btn w-100 mb-2 text-white"
      id="sign-in-with-linkedIn"
      onClick={() => handleSocialLogin(1)}
    >
      <FaLinkedinIn size={20} />
      <span className="ms-2 fs-6"> Continue with LinkedIn</span>
    </button>
  );
};

export default ContinueWithLinkedInButton;
