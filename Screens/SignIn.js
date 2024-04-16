import React, { useContext } from "react";
import ScreenContext from "../contexts/ScreenContext";
import SignInForm from "../components/Auth/SignInForm";
import ContinueWithLinkedInButton from "../components/Auth/button/ContinueWithLinkedInButton";
import ContinueWithGoogleButton from "../components/Auth/button/ContinueWithGoogleButton";
import AuthContext from "../contexts/AuthContext";
import RemoveSessions from "../components/Auth/RemoveSessions";

const SignIn = () => {
  const { navigateToPage } = useContext(ScreenContext);

  return (
    <div className="sign-in-main container px-4 pt-5">
      <div className="mb-3 auth-head-content">
        <h1>Welcome Back!</h1>
        <p>Sign in with email</p>
      </div>
      <div className="sign-in-form mt-5">
    
        <SignInForm />
      </div>
      <div className="mt-5">
        <div className="text-center mb-4 or-with-label">
          <span>or Sign in with</span>
        </div>
        <ContinueWithLinkedInButton />
        <ContinueWithGoogleButton />
        <div className="text-center mt-2 auth-footer-label">
          New to Skoop?{" "}
          <span
            onClick={() => navigateToPage("SignUp")}
            className="cursor-pointer orange-label"
          >
            Create account
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
