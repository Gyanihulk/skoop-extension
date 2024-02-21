import React, { useState, useContext } from "react";
import ScreenContext from "../../contexts/ScreenContext";
import AuthContext from "../../contexts/AuthContext";
import CustomButton from "./button/CustomButton";
import ValidationError from "./ValidationError";
import CustomPasswordInputBox from "./CustomPasswordInputBox";
import CustomInputBox from "./CustomInputBox";

const SignInForm = () => {
  const { navigateToPage } = useContext(ScreenContext);
  const { handleSkoopLogin } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
      setIsUsernameEmpty(value.trim() === "");
    } else if (name === "password") {
      setPassword(value);
      setIsPasswordEmpty(value.trim() === "");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username !== "" && password !== "") {
      console.log("form submitting: ", { username, password });
      handleSkoopLogin(username, password);
    } else {
      setIsUsernameEmpty(true);
      setIsPasswordEmpty(true);
      console.log("username or password can not be empty!");
    }
  };

  return (
    <div className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <CustomInputBox
                type="text"
                placeholder="Email address"
                name="username"
                onChange={handleChange}
                value={username}
                isEmpty={isUsernameEmpty}
              />
              {isUsernameEmpty && (
                <ValidationError title="Please add your email address" />
              )}
            </div>
            <div className="form-group">
              <CustomPasswordInputBox
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={password}
                isEmpty={isPasswordEmpty}
              />
              {isPasswordEmpty && (
                <ValidationError title="Please add your password" />
              )}
            </div>
            <div className="mt-2 forgot-password-label">
              <span
                className="cursor-pointer"
                onClick={() => navigateToPage("ForgotPassword")}
              >
                Forgot Password?
              </span>
            </div>
            <div className="mt-5">
              <CustomButton type="Submit" child="Sign in" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
