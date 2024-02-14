import React from "react";
import { FcGoogle } from "react-icons/fc";

const ContinueWithGoogleButton = () => {
  const handleContinueWithGoogle = () => {
    // Handle continue with Google
  };

  return (
    <button
      className="btn w-100 btn-outline-dark py-2"
      onClick={handleContinueWithGoogle}
      style={{ borderColor: "#dee2e6" }}
    >
      <FcGoogle />
      <span className="fs-6"> Continue with Google</span>
    </button>
  );
};

export default ContinueWithGoogleButton;
