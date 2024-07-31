import React, { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext'
import ScreenContext from '../contexts/ScreenContext'
import CustomButton from '../components/Auth/button/CustomButton'
import RemoveSessions from '../components/Auth/RemoveSessions'
import API_ENDPOINTS from '../components/apiConfig'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'

function SignInWith() {
  const { handleSocialLogin, showClearSessionDialog, deleteMyAllJwtSessionsBySocial, social, setSocial } = useContext(AuthContext)
  const { navigateToPage } = useContext(ScreenContext)
  function handleDeleteSessions() {
    deleteMyAllJwtSessionsBySocial(social)
  }
  const openNewWindow = (url) => {
    document.body.style.overflow = 'auto'
    window.open(url, '_blank')
  }
  return (
    <div className="signin-background-image container-fluid h-100 px-4 d-flex flex-column">
      <div className="pb-5 mt-5 pt-5 text-center">
        <div className="signin-with-content mt-5 pt-3">
          <h3 className="text-white">Hi, Welcome Back!</h3>
          <p className="text-white">It's time to get more clients and connect again with old connections</p>
        </div>
        <div className="mb-5 pb-3 ">
          {showClearSessionDialog && <RemoveSessions onDelete={handleDeleteSessions} />}
          <div className="mt-3 w-100">
            <ContinueWithGoogleButton setSocial={setSocial} message="Sign up with Google" />
          </div>
          <div className="mt-3 w-100">
            <ContinueWithLinkedInButton setSocial={setSocial} message="Sign up with LinkedIn" />
          </div>
        </div>
        <button type="button" id="sign-in-with-email" className="btn w-50 mt-3 mb-2" onClick={() => navigateToPage('SignIn')}>
          Login with email{' '}
        </button>

        <div className="form-text text-center mb-2 text-light signin-with-footer">
          New to Skoop?{' '}
          <a href="#" onClick={() => navigateToPage('SignUp')} className="cursor-pointer  fw-bold footer-font">
            {' '}
            Create Account
          </a>
        </div>
        <div className="text-center mt-2 auth-footer-label">
          <span onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/affiliate/sign-up')} className="cursor-pointer fw-bold footer-font">
            Become an affiliate.
          </span>
        </div>
        <div className="mt-2 cursor-pointer d-flex text-light flex-col auth-footer-label justify-content-center">
          <div onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/privacypolicy')}>Privacy Policy</div> &nbsp;|&nbsp;
          <div onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/termsofuse')}>Terms of Use</div>
        </div>
      </div>
    </div>
  )
}

export default SignInWith
