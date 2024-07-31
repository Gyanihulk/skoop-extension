import React, { useContext } from 'react'
import ScreenContext from '../contexts/ScreenContext'
import SignInForm from '../components/Auth/SignInForm'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'
import AuthContext from '../contexts/AuthContext'
import RemoveSessions from '../components/Auth/RemoveSessions'
import API_ENDPOINTS from '../components/apiConfig'

const SignIn = () => {
  const { navigateToPage } = useContext(ScreenContext)
  const openNewWindow = (url) => {
    document.body.style.overflow = 'auto'
    window.open(url, '_blank')
  }
  function handleDeleteSessions() {
    deleteMyAllJwtSessionsBySocial(social)
  }
  const { deleteMyAllJwtSessionsBySocial, social, setSocial, showClearSessionDialog } = useContext(AuthContext)

  return (
    <div className="sign-in-main container px-4 pt-5">
      <div className="auth-head-content">
        <h1>Welcome Back!</h1>
        <p>Reconnect with your clients and reignite old connections.</p>
      </div>

      <div className="mt-4">
        {showClearSessionDialog && social != null && <RemoveSessions onDelete={handleDeleteSessions} />}

        <ContinueWithGoogleButton setSocial={setSocial} message="Continue with Google" />
        <ContinueWithLinkedInButton setSocial={setSocial} message="Continue with LinkedIn" />

        <div className="text-center or-with-label mt-3">
          <span>OR</span>
        </div>
      </div>
      <div>
        <SignInForm />
      </div>
      <div className="text-center mt-2 auth-footer-label">
        New to Skoop?{' '}
        <span onClick={() => navigateToPage('SignUp')} className="cursor-pointer fw-bold footer-font">
          Create account
        </span>
      </div>
      <div className="text-center mt-2 auth-footer-label">
        <span onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/affiliate/sign-up')} className="cursor-pointer fw-bold footer-font">
          Become an affiliate.
        </span>
      </div>
      <div className="mt-2 cursor-pointer auth-footer-label d-flex flex-col justify-content-center">
        <div onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/privacypolicy')}>Privacy Policy</div> &nbsp;|&nbsp;
        <div onClick={() => openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/termsofuse')}>Terms of Use</div>
      </div>
    </div>
  )
}

export default SignIn
