import React, { useContext, useState } from 'react'
import CustomInputBox from '../components/Auth/CustomInputBox'
import AuthContext from '../contexts/AuthContext'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'
import GlobalStatesContext from '../contexts/GlobalStates'
import CustomButton from '../components/Auth/button/CustomButton'
import { FaCheckCircle } from 'react-icons/fa'
import RemoveSessions from '../components/Auth/RemoveSessions'

const WelcomeAppsumo = () => {
  const { handleRegister, coupon, setSocial, deleteMyAllJwtSessionsBySocial, subscriptionType, showClearSessionDialog } = useContext(AuthContext)

  const [showEmailInput, setShowEmailInput] = useState(false)
  const [email, setEmail] = useState('')

  const handleEmailButtonClick = async () => {
    if (!showEmailInput) {
      // If the input box is not shown yet, show it
      setShowEmailInput(true)
    } else {
      // If the input box is shown and email is entered, call the API
      if (email) {
        await handleRegister(email.split('@')[0], email, null, Intl.DateTimeFormat().resolvedOptions().timeZone)
      }
    }
  }

  return (
    <div className="welcome-main">
      <div className="welcome-content">
        <div className="w-100 top-header mt-5 pt-5">
          <img src="/screens/logo.png" alt="Skoop" />

          <h3 className="welcome-title">Skoop</h3>

          <h4 className="coupon-text">
            {coupon} <FaCheckCircle className="check-icon" color="#ffc107" />
          </h4>
          <p className='mb-2'>{subscriptionType == 'appsumo' ? 'Appsumo' : 'Lifetime'} Coupon Valid </p>
          <h3 className="mt-4"> Welcome {subscriptionType == 'appsumo' ? 'Appsumo' : ''} User</h3>
          <p>Please activate your lifetime access account.</p>
        </div>
        {showClearSessionDialog && <RemoveSessions onDelete={() => deleteMyAllJwtSessionsBySocial()} />}
        <div className="mt-4">
          <ContinueWithGoogleButton setSocial={setSocial} message="Continue with Google" />
          <ContinueWithLinkedInButton setSocial={setSocial} message="Continue with LinkedIn" />
        </div>
        <div className="text-center or-with-label mt-3">
          <p>OR</p>
        </div>
        <div className="mt-3">
          {showEmailInput && <CustomInputBox type="text" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} isEmpty={''} />}
          <div className={showEmailInput && 'mt-3'}>
            <CustomButton child={showEmailInput ? 'Activate with Email' : 'Continue with Email'} onClick={handleEmailButtonClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeAppsumo
