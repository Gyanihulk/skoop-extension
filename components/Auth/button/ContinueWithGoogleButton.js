import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import AuthContext from "../../../contexts/AuthContext";

const ContinueWithGoogleButton = ({setSocial}) => {
  const { handleSocialLogin } = useContext(AuthContext);
  return (
    <button
      className="btn w-100"
      id="sign-in-with-google"
      onClick={() => {handleSocialLogin(2);setSocial(2);}}
    >
      <FcGoogle size={20} />
      <span className="ms-2 fs-6"> Continue with Google</span>
    </button>
  );
};

export default ContinueWithGoogleButton;
