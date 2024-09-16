import React, { useContext, useEffect, useState } from 'react'
import CustomInputBox from '../components/Auth/CustomInputBox'
import AuthContext from '../contexts/AuthContext'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'
import CustomButton from '../components/Auth/button/CustomButton'
import { FaCheckCircle } from 'react-icons/fa'
import RemoveSessions from '../components/Auth/RemoveSessions'

const WelcomeStripe = () => {
  const { subscriptionType, setSubscriptionType,  coupon,products,  handleRegister, setSocial, couponInfo,  couponValid ,showClearSessionDialog,deleteMyAllJwtSessionsBySocial,getProducts} = useContext(AuthContext)
  const handleSubscriptionChange = (type) => {
    setSubscriptionType(type)
  }
  useEffect(() => {
    ;(async () => {

      const products =await getProducts();
     
    })()
  }, [])
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

  const monthlyProduct = products.length>0 && products.find(product => product.name === 'monthly');
  const yearlyProduct = products.length>0 && products.find(product => product.name === 'yearly');
  
  const monthlyPrice = monthlyProduct?.price || 47;
  const yearlyPrice = yearlyProduct?.price ||  451;
  // Calculate discounted prices
  const discountedMonthlyPrice = couponInfo?.discount?.percent_off
    ? ((monthlyPrice * (100 - couponInfo?.discount?.percent_off)) / 100).toFixed(2)
    : couponInfo?.discount?.amount_off
      ? (monthlyPrice - couponInfo?.discount?.amount_off).toFixed(2)
      : monthlyPrice

  const discountedYearlyPrice = couponInfo?.discount?.percent_off
    ? ((yearlyPrice * (100 - couponInfo?.discount?.percent_off)) / 100).toFixed(2)
    : couponInfo?.discount?.amount_off
      ? (yearlyPrice - couponInfo?.discount?.amount_off).toFixed(2)
      : yearlyPrice
  return (
    <div className="welcome-main">
      <div className="welcome-content">
        <div className="w-100 top-header">
        
          <h4 className="coupon-text">
            {coupon} <FaCheckCircle className="check-icon" color="#ffc107" />
          </h4>
          <p> Coupon applied. Please select your plan.</p>
          {couponInfo && couponValid && (
            <div className="my-1 mx-0 px-0">
              {couponInfo?.discount && (
                <span className="badge bg-warning text-dark fw-bold w-100" style={{ fontSize: '0.9rem', height: '24px' }}>
                  Discount of {couponInfo?.discount?.amount_off ? `$${couponInfo?.discount?.amount_off}` : `${couponInfo?.discount?.percent_off}%`}{' '}
                  {couponInfo?.discount?.frequency_type === 'repeating' ? `for ${couponInfo?.discount?.duration_in_months} months.` : couponInfo?.discount?.frequency_type === 'once' ? 'on first billing cycle.' : 'on every billing cycle.'}
                </span>
              )}
              {couponInfo?.discount?.trial_period && (
                <span className="mt-1 badge bg-warning text-dark fw-bold w-100" style={{ fontSize: '0.9rem', height: '24px' }}>
                  Extended Trial period to {couponInfo?.discount.trial_period} days.
                </span>
              )}
            </div>
          )}
        </div>
        <div className="subscription-options align-items-center">
          <div className="subscription-option-welcome d-flex flex-row align-items-center">
            <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" checked={subscriptionType === 'monthly'} onChange={() => handleSubscriptionChange('monthly')} />
            <div className="ps-4 pt-2">
              <h5>$ {discountedMonthlyPrice} Monthly</h5>
              <p>Original Price : $ {monthlyPrice} /month</p>
            </div>
          </div>
          <div className="subscription-option-welcome d-flex flex-row align-items-center">
            <div>
              <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" checked={subscriptionType === 'yearly'} onChange={() => handleSubscriptionChange('yearly')} />
            </div>

            <div className="ps-4 pt-2">
              <h5>$ {discountedYearlyPrice} Yearly</h5>
              <p>Original Price : $ {yearlyPrice} /year</p>
            </div>
          </div>
        </div>
        {showClearSessionDialog  && <RemoveSessions onDelete={()=>deleteMyAllJwtSessionsBySocial()} />}
        <div className="mt-5">
          <ContinueWithGoogleButton setSocial={setSocial} message="Continue with Google" />
          <ContinueWithLinkedInButton setSocial={setSocial} message="Continue with LinkedIn" />
        </div>
        <div className="text-center ">
          <p className='mb-1 mt-4'>OR</p>
        </div>
        <div className="mt-4">
          {showEmailInput && <CustomInputBox type="text" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} isEmpty={''} />}
          <div className={showEmailInput && 'mt-1'}>
            <CustomButton child={showEmailInput ? 'Activate with Email' : 'Continue with Email'} onClick={handleEmailButtonClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeStripe
