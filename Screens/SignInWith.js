import React, { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import ScreenContext from "../contexts/ScreenContext";
import CustomButton from "../components/Auth/button/CustomButton";
import RemoveSessions from "../components/Auth/RemoveSessions";
import API_ENDPOINTS from "../components/apiConfig";

function SignInWith() {
  const { handleSocialLogin, deleteMyAllJwtSessions,showClearSessionDialog ,deleteMyAllJwtSessionsBySocial} = useContext(AuthContext);
  const [social,setSocial]=useState()
  const { navigateToPage } = useContext(ScreenContext);
  function handleDeleteSessions(){
    deleteMyAllJwtSessionsBySocial(social);
  }
  const openNewWindow = (url) => {
    document.body.style.overflow = 'auto'
    window.open(url, '_blank')
  }
  return (
    <div className="signin-background-image container-fluid h-100 px-4 d-flex flex-column">
      <div className="pb-5 mt-5 pt-5">
        <div className="signin-with-content mt-5 pt-3">
          <h3 className="text-white">Hi, Welcome Back!</h3>
          <p className="text-white">
            It's time to get more clients and connect again with old connections
          </p>
        </div>
        <div className="mb-5 pb-3">
        {showClearSessionDialog && <RemoveSessions onDelete={handleDeleteSessions}/>}
          <div className="mt-3 w-100">
            <CustomButton
              child="Login with LinkedIn"
              onClick={() =>{ handleSocialLogin(1);setSocial(1)}}
            />
          </div>
          <div className="mt-3 w-100">
            <CustomButton
              child="Login with Google"
              onClick={() => {handleSocialLogin(2);setSocial(2)}}
            />
          </div>
        </div>
        <button
          type="button"
          id="sign-in-with-email"
          className="btn w-100 mt-3 mb-2 login-with-email-btn"
          onClick={() => navigateToPage('SignIn')}
        >
          Login with email{' '}
        </button>

        <div className="form-text text-center mb-2 text-light signin-with-footer">
          New to Skoop?{' '}
          <a
            href="#"
            onClick={() => navigateToPage('SignUp')}
            className="fw-bold footer-font"
          >
            {' '}
            Create Account
          </a>
        </div>
        <div className="mt-2 cursor-pointer d-flex text-light flex-col auth-footer-label justify-content-center">
          <div
            onClick={()=>openNewWindow(
              API_ENDPOINTS.skoopCalendarUrl + '/privacypolicy'
            )}
          >
            Privacy Policy
          </div>{' '}
          &nbsp;|&nbsp;
          <div
            onClick={()=>openNewWindow(
              API_ENDPOINTS.skoopCalendarUrl + '/termsofuse'
            )}
          >
            Terms of Use
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInWith
