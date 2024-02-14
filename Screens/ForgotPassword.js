import React, { useState, useContext } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import CustomInputBox from "./components/CustomInputBox";
import ScreenContext from "../contexts/ScreenContext";

const ForgotPassword = () => {
  const [isForgotSubmit, setIsForgotSubmit] = useState(false);
  const { navigateToPage } = useContext(ScreenContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailValue = event.target.elements.email.value.trim();

    if (!emailValue) {
      console.log(`forgot password 1: ${emailValue}`);
      setIsForgotSubmit(false);
    } else {
      console.log(`forgot password 2: ${emailValue}`);
      setIsForgotSubmit(true);
    }
  };

  return (
    <div class="container px-4 forgot-password-main mt-5">
      <div
        className="d-flex cursor-pointer"
        onClick={() => navigateToPage("SignIn")}
      >
        <IoMdArrowBack size={20} />
        <h6 className="ms-1">Back to Login</h6>
      </div>
      <div className="forgot-password-content">
        {!isForgotSubmit ? (
          <form onSubmit={handleSubmit}>
            <h3>Forgot Password</h3>
            <p class="text-muted fs-6 mb-4">
              Enter your email and we'll send you instructions on how to reset
              your password.
            </p>
            <div class="form-group">
              <CustomInputBox
                type="email"
                placeholder="Email address"
                name="email"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100 mt-5 py-2"
              style={{ backgroundColor: "#2D68C4" }}
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="d-flex flex-column justify-content-center align-content-center">
            <div className="d-flex justify-content-center w-100 mb-4">
              <MdEmail size={60} color="#2D68C4" />
            </div>
            <p className="text-center">
              Email has been sent to your registered email. Please check the
              reset link to reset the password.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
