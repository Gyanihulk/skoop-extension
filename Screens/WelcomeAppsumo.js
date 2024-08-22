import React, { useContext } from 'react'
import CustomInputBox from '../components/Auth/CustomInputBox'
import AuthContext from '../contexts/AuthContext'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'
import GlobalStatesContext from '../contexts/GlobalStates'
import CustomButton from '../components/Auth/button/CustomButton'
import { FaCheckCircle } from 'react-icons/fa'

const WelcomeAppsumo = () => {
  const { subscriptionType, setSubscriptionType,verifyCoupon, coupon, setCoupon, setSocial, couponInfo, setCouponInfo, couponValid, setCouponValid } = useContext(AuthContext)

  const handleSubscriptionChange = (type) => {
    setSubscriptionType(type)
  }
  const monthlyPrice = 47; // Original monthly price
  const yearlyPrice = 451; // Original yearly price


  return (
    <div className="welcome-main">
      <div className="welcome-content">
        <div className="w-100 top-header mt-5 pt-5">
          <img src="/screens/logo.png" alt="Skoop" />

          <h3 className="welcome-title">Skoop</h3>
        
           <h4 className="coupon-text" >{coupon} {' '}<FaCheckCircle className="check-icon" color='#ffc107' /></h4>
           <p> Appsumo Coupon Valid </p>
           <h3> Welcome Appsumo User</h3>
           <p>Please activate your lifetime access account.</p>
        </div>

        <div className="mt-4">
          <ContinueWithGoogleButton setSocial={setSocial} message="Continue with Google" />
          <ContinueWithLinkedInButton setSocial={setSocial} message="Continue with LinkedIn" />
        </div>

        <div className="mt-4">
          <CustomButton child="Continue with Email" onClick={() => {}} />
        </div>
      </div>
    </div>
  )
}

export default WelcomeAppsumo
