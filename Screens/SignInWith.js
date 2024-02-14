import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import AuthContext from "../contexts/AuthContext";
import ScreenContext from "../contexts/ScreenContext";

function SignInWith() {
  const { handleSocialLogin } = useContext(AuthContext);

  const { navigateToPage } = useContext(ScreenContext);
  return (
    <div className="signin-background-image container-fluid h-100 px-4 d-flex flex-column justify-content-end">
      <div className="pb-5">
        <div>
          <h3 className="text-white">Hi, Welcome Back!</h3>
          <p className="text-white">
            It's time to get more clients and connect again with old connections
          </p>
        </div>
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block w-100 button-size mt-4 mb-3"
            style={{
              backgroundColor: "#2d68c4",
              fontSize: "16px",
              fontWeight: "600",
            }}
            onClick={() => handleSocialLogin(2)}
          >
            Login with Google
          </button>

          <button
            type="button"
            className="btn btn-primary btn-lg btn-block w-100 button-size mb-4"
            style={{
              backgroundColor: "#2d68c4",
              fontSize: "16px",
              fontWeight: "600",
            }}
            onClick={() => handleSocialLogin(1)}
          >
            Login with LinkedIn
          </button>
        </div>
        <button
          type="button"
          className="btn btn-lg btn-block w-100 mt-3 mb-2"
          style={{
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            background: "transparent",
          }}
          onClick={() => navigateToPage("SignIn")}
        >
          Login with email{" "}
        </button>

        <div className="form-text text-center mb-2 text-light">
          New to Skoop?{" "}
          <a
            href="#"
            onClick={() => navigateToPage("SignUp")}
            className="fw-bold footer-font"
          >
            {" "}
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignInWith;
