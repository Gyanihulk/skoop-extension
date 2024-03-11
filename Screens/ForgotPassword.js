import React, { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import CustomInputBox from "../components/Auth/CustomInputBox";
import ScreenContext from "../contexts/ScreenContext";
import CustomButton from "../components/Auth/button/CustomButton";
import ValidationError from "../components/Auth/ValidationError";
import OtpTimer from "otp-timer";
import AuthContext from "../contexts/AuthContext";

const ForgotPassword = () => {
  const { navigateToPage } = useContext(ScreenContext);
  const { getOtpForPasswordReset, resetPasswordUsingOtp } =
    useContext(AuthContext);

  const [isOTPSent, setIsOTPSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);

  const [isOtpEmpty, setIsOTPEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const [isInvalidUser, setIsInvalidUser] = useState(false);
  const [isInvalidOTP, setIsInvalidOTP] = useState(false);

  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isResendOTPButton, isSetResendOTPButton] = useState(true);
  const [timer, setTimer] = useState(30);

  const handleChangeSendOTP = (event) => {
    setIsInvalidUser(false);
    setEmail(event.target.value);
    setIsEmailEmpty(event.target.value.trim() === "");
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();

    if (email !== "") {
      const isOTPSendToMail = await getOtpForPasswordReset(email);
      if (isOTPSendToMail) {
        setIsOTPSent(true);
      } else {
        setIsInvalidUser(true);
      }
    } else {
      setIsEmailEmpty(true);
      setIsOTPSent(false);
    }
  };

  const handleChangeResetPassword = (event) => {
    const { name, value } = event.target;
    if (name === "otp") {
      setOTP(value);
      setIsOTPEmpty(value.trim() === "");
      setIsInvalidOTP(false);
    } else if (name === "password") {
      setPassword(value);
      setIsPasswordEmpty(value.trim() === "");
      setIsPasswordMatch(false);
    } else if (name == "confirmPassword") {
      setConfirmPassword(value);
      setIsConfirmPasswordEmpty(value.trim() === "");
      setIsPasswordMatch(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (otp !== "" && password !== "" && confirmPassword !== "") {
      console.log("reset password: ", { otp, password, confirmPassword });
      if (password === confirmPassword) {
        const isPasswordReset = await resetPasswordUsingOtp(
          email,
          otp,
          password
        );
        if (isPasswordReset) {
          navigateToPage("SignIn");
        } else {
          setIsInvalidOTP(true);
        }
      } else {
        setIsPasswordMatch(true);
      }
    } else {
      setIsOTPEmpty(otp.trim() === "");
      setIsPasswordEmpty(password.trim() === "");
      setIsConfirmPasswordEmpty(confirmPassword.trim() === "");
      console.log("username or password can not be empty!");
    }
  };

  const startResentOTPTimer = () => {
    let seconds = 30;
    isSetResendOTPButton(false);
    const interval = setInterval(function () {
      seconds--;
      setTimer(seconds);
      if (seconds == 0) {
        clearInterval(interval);
        isSetResendOTPButton(true);
      }
    }, 1000);
  };

  const handleResendOTP = () => {
    getOtpForPasswordReset(email);
    startResentOTPTimer();
  };

  return (
    <div class="container px-4 forgot-password-main mt-5">
      <div className="forgot-password-head">
        <div
          className="d-flex cursor-pointer"
          onClick={() => navigateToPage("SignIn")}
        >
          <IoMdArrowBack size={20} color="#2C2D2E" />
          <h6 className="ms-1">Back to Login</h6>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <img src="/screens/logo.png" alt="Skoop" />
        </div>
      </div>
      <div className="forgot-password-content">
        {!isOTPSent ? (
          <form onSubmit={handleSendOTP}>
            <h3 className="forgot-password-title">Forgot Password</h3>
            <p class="text-muted fs-6 mb-4 forgot-password-description">
              Enter your email and we'll send you instructions on how to reset
              your password.
            </p>
            <h3 className="forgot-password-step-label">Step 1:</h3>
            <div class="form-group">
              <CustomInputBox
                type="email"
                placeholder="Enter email address"
                name="email"
                value={email}
                onChange={handleChangeSendOTP}
              />
              {isEmailEmpty && (
                <ValidationError title="Please add you email address" />
              )}
              {isInvalidUser && (
                <ValidationError title="Please enter correct email" />
              )}
            </div>
            <div className="mt-4">
              <CustomButton type="submit" child="Next" />
            </div>
          </form>
        ) : (
          <form className="mt-5" onSubmit={handleResetPassword}>
            <div className="mt-4">
              <h3 className="forgot-password-step-label">Step 2:</h3>
              <p
                className="forgot-password-description"
                class="text-muted fs-6 mb-4"
              >
                Enter the OTP that we sent on your registered email and choose a
                new password.
              </p>
              <div class="form-group">
                <CustomInputBox
                  type="text"
                  placeholder="Enter OTP"
                  name="otp"
                  onChange={handleChangeResetPassword}
                />
                {isOtpEmpty && <ValidationError title="Please enter OTP" />}
                {isInvalidOTP && (
                  <ValidationError title="Please enter correct OTP" />
                )}
                <CustomInputBox
                  type="password"
                  placeholder="New password"
                  name="password"
                  onChange={handleChangeResetPassword}
                />
                {isPasswordEmpty && (
                  <ValidationError title="Please enter new password" />
                )}
                <CustomInputBox
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  onChange={handleChangeResetPassword}
                />
                {isConfirmPasswordEmpty && (
                  <ValidationError title="Please enter confirm password" />
                )}
                {isPasswordMatch && (
                  <ValidationError title="Password does not match" />
                )}
              </div>
              <div className="mt-4">
                <CustomButton type="submit" child="Submit" />
                <div className="d-flex justify-content-center mt-3 resend-otp">
                  {isResendOTPButton ? (
                    <p>
                      Haven't received OTP?{" "}
                      <span
                        onClick={handleResendOTP}
                        className="cursor-pointer orange-label"
                      >
                        Send Again
                      </span>
                    </p>
                  ) : (
                    <p>Resend OTP in: {timer}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
