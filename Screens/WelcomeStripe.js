import React, { useContext } from 'react'
import CustomInputBox from '../components/Auth/CustomInputBox'
import AuthContext from '../contexts/AuthContext'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'
import GlobalStatesContext from '../contexts/GlobalStates'
import CustomButton from '../components/Auth/button/CustomButton'
import { FaCheckCircle } from 'react-icons/fa'

const WelcomeStripe = () => {
  const { verifyCoupon, coupon, setCoupon, setSocial, couponInfo, setCouponInfo, couponValid, setCouponValid } = useContext(AuthContext)
  const { subscriptionType, setSubscriptionType } = useContext(GlobalStatesContext)
  const handleSubscriptionChange = (type) => {
    setSubscriptionType(type)
  }
  const monthlyPrice = 47; // Original monthly price
  const yearlyPrice = 451; // Original yearly price

  // Calculate discounted prices
  const discountedMonthlyPrice = couponInfo?.discount?.percent_off
    ? ((monthlyPrice * (100 - couponInfo?.discount?.percent_off)) / 100).toFixed(2)
    : couponInfo?.discount?.amount_off
      ? (monthlyPrice - couponInfo?.discount?.amount_off).toFixed(2)
      : monthlyPrice;

  const discountedYearlyPrice = couponInfo?.discount?.percent_off
    ? ((yearlyPrice * (100 - couponInfo?.discount?.percent_off)) / 100).toFixed(2)
    : couponInfo?.discount?.amount_off
      ? (yearlyPrice - couponInfo?.discount?.amount_off).toFixed(2)
      : yearlyPrice;
  return (
    <div className="welcome-main">
      <div className="welcome-content">
        <div className="w-100 top-header">
          <img src="/screens/logo.png" alt="Skoop" />

          <h3 className="welcome-title">Skoop</h3>
           <h4 className="coupon-text" >{coupon} {' '}<FaCheckCircle className="check-icon" color='#ffc107' /></h4>
           <p> Coupon Applied .Please select your plan.</p>
           {couponInfo && couponValid && (
        <div className="my-1 mx-0 px-0">
          
          {couponInfo?.discount && (
            <span className="badge bg-warning text-dark fw-bold w-100" style={{ fontSize: '0.9rem', height: '24px' }}>
              Discount of {couponInfo?.discount?.amount_off
                ? `$${couponInfo?.discount?.amount_off}`
                : `${couponInfo?.discount?.percent_off}%`}{' '}
              {couponInfo?.discount?.frequency_type === "repeating"
                ? `for ${couponInfo?.discount?.duration_in_months} months.`
                : couponInfo?.discount?.frequency_type === "once"
                ? "on first billing cycle."
                : "on every billing cycle."}
            </span>
          )}
          {couponInfo?.discount?.trial_period && (
            <span className="badge bg-warning text-dark fw-bold w-100" style={{ fontSize: '0.9rem', height: '24px' }}>
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
            <h5>${discountedMonthlyPrice} Monthly</h5>
            <p>Real Price : $ {monthlyPrice} /month</p>
            </div>
          </div>
          <div className="subscription-option-welcome d-flex flex-row align-items-center">
            <div>
              <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" checked={subscriptionType === 'yearly'} onChange={() => handleSubscriptionChange('yearly')} />
            </div>

            <div className="ps-4 pt-2">
            <h5>${discountedYearlyPrice} Yearly</h5>
            <p>Real Price : $ {yearlyPrice} /year</p>
            </div>
          </div>
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

export default WelcomeStripe
