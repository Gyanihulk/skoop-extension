import React, { useContext } from "react";
import SignInForm from "./components/SignInForm";
import ContinueWithLinkedInButton from "./components/button/ContinueWithLinkedInButton";
import ContinueWithGoogleButton from "./components/button/ContinueWithGoogleButton";
import ScreenContext from "../contexts/ScreenContext";

const SignIn = () => {
  const { navigateToPage } = useContext(ScreenContext);

  return (
    <div className="sign-in-main container px-4 py-5">
      <div className="mb-3">
        <h1>Welcome Back!</h1>
        <span class="text-secondary">Sign in with email</span>
      </div>
      <div>
        <SignInForm />
      </div>
      <div className="mt-5">
        <div className="text-center mb-4">
          <span>or Sign in with</span>
        </div>
        <ContinueWithLinkedInButton />
        <ContinueWithGoogleButton />
        <div className="text-center mt-3">
          New to Skoop?{" "}
          <span
            onClick={() => navigateToPage("SignUp")}
            className="fw-bold cursor-pointer"
            style={{ color: "#FF8210" }}
          >
            Create account
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
