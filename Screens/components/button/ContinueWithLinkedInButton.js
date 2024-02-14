import React from "react";
import { FaLinkedinIn } from "react-icons/fa6";

const ContinueWithLinkedInButton = () => {
  const handleContinueWithLinkedIn = () => {
    // Handle continue with LinkedIn
  };

  return (
    <button
      className="btn w-100 py-2 mb-3 text-white"
      s
      onClick={handleContinueWithLinkedIn}
      style={{ backgroundColor: "#007BB5" }}
    >
      <FaLinkedinIn />
      <span className="fs-6"> Continue with LinkedIn</span>
    </button>
  );
};

export default ContinueWithLinkedInButton;
