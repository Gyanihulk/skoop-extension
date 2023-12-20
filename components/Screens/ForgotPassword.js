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
    <div>
      {step === 1 && (
        <form onSubmit={handleSubmitForm1}>
          <h2>Step 1</h2>
          <input
            type="text"
            placeholder="enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Next</button>
        </form>
      )}
      {step === 2 && (
        <div>
        <form onSubmit={handleSubmitForm2}>
          <h2>Step 2</h2>
          <input
            type="text"
            placeholder="enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="enter OTP"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleSubmitForm1}>send otp again</button>
        <button onClick={()=>setStep(1)}>back</button>
        </div>
      )}
      <button onClick={()=>navigateToPage("SignIn")}>go to sign in</button>
    </div>
  );
};

export default ForgotPassword;
