import React, { useContext } from "react";
import { FaLinkedinIn } from "react-icons/fa6";
import AuthContext from "../../../contexts/AuthContext";

const ContinueWithLinkedInButton = () => {
 
  const { handleSocialLogin } = useContext(AuthContext);
  return (
    <button
      className="btn w-100 py-2 mb-3 text-white"
      s
      onClick={() => handleSocialLogin(1)}
      style={{ backgroundColor: "#007BB5" }}
    >
      <FaLinkedinIn />
      <span className="fs-6"> Continue with LinkedIn</span>
    </button>
  );
};

export default ContinueWithLinkedInButton;
