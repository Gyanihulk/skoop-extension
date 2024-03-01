import React, { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import ScreenContext from "../contexts/ScreenContext";
import CustomButton from "../components/Auth/button/CustomButton";

function SignInWith() {
  const { handleSocialLogin } = useContext(AuthContext);

  const { navigateToPage } = useContext(ScreenContext);
  return (
    <div className="signin-background-image container-fluid h-100 px-4 d-flex flex-column justify-content-end">
      <div className="pb-5">
        <div className="signin-with-contente">
          <h3 className="text-white">Hi, Welcome Back!</h3>
          <p className="text-white">
            It's time to get more clients and connect again with old connections
          </p>
        </div>
        <div className="mb-5 pb-3">
          <div className="mt-3 w-100">
            <CustomButton
              child="Login with LinkedIn"
              onClick={() => handleSocialLogin(1)}
            />
          </div>
          <div className="mt-3 w-100">
            <CustomButton
              child="Login with Google"
              onClick={() => handleSocialLogin(2)}
            />
          </div>
        </div>
        <button
          type="button"
          id="sign-in-with-email"
          className="btn w-100 mt-3 mb-2 login-with-email-btn"
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
