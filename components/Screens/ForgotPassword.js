import React, { useState,useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import ScreenContext from '../../contexts/ScreenContext';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // State to manage the current step
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [OTP, setOTP] = useState('');
  const {getOtpForPasswordReset,resetPasswordUsingOtp} = useContext(AuthContext);
  const { navigateToPage } = useContext(ScreenContext);

  const handleSubmitForm1 =async (e) => {
    e.preventDefault();
    const isOtpSent=await getOtpForPasswordReset(email);
    if(!isOtpSent){
        // show error page
        alert("could not send otp")
        return ;
    }
    else alert("OTP sent")
    setStep(2); // Move to step 2
  };

  const handleSubmitForm2 = async(e) => {
    e.preventDefault();
    if(confirmPassword!=newPassword){
        alert("confirm password and new password fields do not match")
        return ;
    }
    const isPasswordReset=await resetPasswordUsingOtp(email,OTP,newPassword);
    if(!isPasswordReset){
        // show error page;
    }
    else{
        alert("password reset successfull");
        navigateToPage("SignIn");
    }
    
  };

  return (
    <div className="container">
  <div className="row">
    <div className="col-md-6 offset-md-3">
      <div className="card my-1">
        {step === 1 && (
          <form
            className="card-body cardbody-color p-lg-5"
            onSubmit={handleSubmitForm1}
          >
            <h2 className="text-center text-dark mt-3">Forgot Password ?</h2>
            <p className="text-center">You can reset your password here.</p>
            <div className="text-center">
             <img
                src="chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/icons/icon.png"
                className="img-fluid profile-image-pic img-thumbnail rounded-circle my-2"
                width="100px"
                alt="profile"
              />          
            </div>
            <h4 className="text-center text-dark text-decoration-underline mb-3">Step 1</h4>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary mb-2 w-100">
                Next
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div>
            <form
              className="card-body cardbody-color p-lg-5"
              onSubmit={handleSubmitForm2}
            >
              <div className="text-center">
              <img
                  src="chrome-extension://gplimcomjkejccjoafekbjedgmlclpag/icons/icon.png"
                  className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                  width="100px"
                  alt="profile"
                />          
              </div>

              <h2 className="text-center text-dark text-decoration-underline mb-3">Step 2</h2>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </div>
            </form>

            <div className="text-center">
              <button
                onClick={handleSubmitForm1}
                className="btn btn-link"
              >
                Send OTP Again
              </button>
              <button
                onClick={() => setStep(1)}
                className="btn btn-link text-dark"
              >
                Back
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-3">
          <button
            onClick={() => navigateToPage("SignIn")}
            className="btn btn-outline-dark btn-sm"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ForgotPassword;
