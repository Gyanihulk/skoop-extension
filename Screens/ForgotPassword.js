import React, { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import CustomInputBox from "../components/Auth/CustomInputBox";
import ScreenContext from "../contexts/ScreenContext";
import CustomButton from "../components/Auth/button/CustomButton";
import OtpTimer from "otp-timer";
import AuthContext from "../contexts/AuthContext";

const ForgotPassword = () => {
  const { navigateToPage } = useContext(ScreenContext);
  const { getOtpForPasswordReset, resetPasswordUsingOtp } =
    useContext(AuthContext);

  const [isOTPSent, setIsOTPSent] = useState(false);
  const [emailValue, setEmailValue] = useState();
  const [otpEmpty, setOTPEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [confirmPasswordEmpty, setConfirmPasswordEmpty] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const handleSendOTP = (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value.trim();

    setEmailValue(email);
    setIsOTPSent(!emailValue);

    if (email) {
      getOtpForPasswordReset(email);
      setIsOTPSent(true);
    } else {
      setIsOTPSent(false);
    }
  };

  const handleResetPassword = (event) => {
    event.preventDefault();

    const otpValue = event.target.elements.otp.value.trim();
    const passwordValue = event.target.elements.password.value.trim();
    const confirmPasswordValue =
      event.target.elements.confirmPassword.value.trim();

    setOTPEmpty(!otpValue);
    setPasswordEmpty(!passwordValue);
    setConfirmPasswordEmpty(!confirmPasswordValue);

    if (otpValue && passwordValue && confirmPasswordValue) {
      if (passwordValue === confirmPasswordValue) {
        resetPasswordUsingOtp(emailValue, otpValue, passwordValue);
      } else {
        setIsPasswordMatch(true);
      }
      console.log(`Email value: ${emailValue}`);
      console.log(`OTP: ${otpValue}`);
      console.log(`Password: ${passwordValue}`);
      console.log(`Confirm Password: ${confirmPasswordValue}`);
    }
  };

  const handleResendOTP = () => {
    getOtpForPasswordReset(emailValue);
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
        {!isOTPSent ? (
          <form onSubmit={handleSendOTP}>
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
            <div className="mt-3">
              <CustomButton type="submit" child="Submit" />
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div class="form-group">
              <CustomInputBox type="text" placeholder="Enter OTP" name="otp" />
              {otpEmpty && (
                <label className="mb-1" style={{ color: "#E31A1A" }}>
                  Please enter otp!
                </label>
              )}
              <CustomInputBox
                type="password"
                placeholder="New password"
                name="password"
              />
              {passwordEmpty && (
                <label className="mb-1" style={{ color: "#E31A1A" }}>
                  Please enter password!
                </label>
              )}
              <CustomInputBox
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
              />
              {confirmPasswordEmpty && (
                <label className="mb-1" style={{ color: "#E31A1A" }}>
                  Please enter confirm password!
                </label>
              )}
              {isPasswordMatch && (
                <label className="text-danger mb-1">
                  Password does not match!
                </label>
              )}
            </div>
            <div className="mt-3">
              <CustomButton type="submit" child="Change Password" />
              <div className="d-flex justify-content-between mt-2">
                <OtpTimer
                  seconds={30}
                  minutes={0}
                  buttonColor={"#321fdb"}
                  background={"#fff"}
                  resend={handleResendOTP}
                  text={"Resend OTP in"}
                  ButtonText={"Resend OTP"}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
