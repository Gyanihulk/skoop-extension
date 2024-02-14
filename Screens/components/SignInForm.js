import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ScreenContext from "../../contexts/ScreenContext";
import AuthContext from "../../contexts/AuthContext";

const SignInForm = () => {
  const { navigateToPage } = useContext(ScreenContext);
  const { handleSkoopLogin } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const usernameValue = event.target.elements.username.value.trim();
    const passwordValue = event.target.elements.password.value.trim();

    console.log(`username: ${usernameValue}`);
    console.log(`password: ${passwordValue}`);
    handleSkoopLogin(event);

    // if (!usernameValue) {
    //   setUsernameEmpty(true);
    //   console.log("Username is empty");
    // } else {
    //   setUsernameEmpty(false);
    // }

    // if (!passwordValue) {
    //   setPasswordEmpty(true);
    //   console.log("Password is empty");
    // } else {
    //   setPasswordEmpty(false);
    // }
  };

  return (
    <div className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-2 py-2 rounded-3"
                id="username"
                placeholder="Email address"
              />
              {usernameEmpty && (
                <label className="mb-3" style={{ color: "#E31A1A" }}>
                  Please add your email address
                </label>
              )}
            </div>
            <div className="form-group">
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mb-2 py-2 rounded-3"
                  id="password"
                  placeholder="Password"
                />
                <button
                  className="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y border-0"
                  type="button"
                  onClick={handleTogglePassword}
                  style={{ background: "none", color: "#2A2B39" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordEmpty && (
                <label className="mb-3" style={{ color: "#E31A1A" }}>
                  Please add your password
                </label>
              )}
            </div>
            <div className="fw-medium">
              <span
                className="cursor-pointer"
                onClick={() => navigateToPage("ForgotPassword")}
              >
                Forgot Password?
              </span>
            </div>
            <button
              type="submit"
              className="btn w-100 mt-4 py-2 text-white"
              style={{ backgroundColor: "#2D68C4" }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
