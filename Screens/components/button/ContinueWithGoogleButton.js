import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import AuthContext from "../../../contexts/AuthContext";

const ContinueWithGoogleButton = () => {
 
  const { handleSocialLogin } = useContext(AuthContext);
  return (
    <button
      className="btn w-100 btn-outline-dark py-2"
      onClick={() => handleSocialLogin(2)}
      style={{ borderColor: "#dee2e6" }}
      
    >
      <FcGoogle />
      <span className="fs-6"> Continue with Google</span>
    </button>
  );
};

export default ContinueWithGoogleButton;
