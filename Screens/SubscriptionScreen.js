import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../contexts/AuthContext'
import { FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import GlobalStatesContext from '../contexts/GlobalStates'
import { LockIcon } from '../components/SVG/LockIcon'
import ScreenContext from '../contexts/ScreenContext'
import ConfirmationModal from '../components/ConfirmationModal'

const SubscriptionScreen = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { createSubscription, verifyCoupon, getMySubscription, subscriptionType, setSubscriptionType,products,getProducts, appConfig, getAppConfig } = useContext(AuthContext)
  const { navigateToPage } = useContext(ScreenContext)
  const [sessionUrl, setSessionUrl] = useState('')
  const handleSubscriptionChange = (type) => {
    setSubscriptionType(type)
  }

  const [couponCode, setCouponCode] = useState('')
  const [couponValid, setCouponValid] = useState(false)
  const [couponInfo, setCouponInfo] = useState()
  const handleCreateSubscription = async () => {
    const today = new Date()
    const startDate = today.toISOString().split('T')[0]
    let subsData = {
      start_date: startDate,
      plan_type: subscriptionType,
    }
    if (couponCode.length >= 3 && couponValid) {
      subsData.coupon = couponCode.trim()
    }
    const session = await createSubscription(subsData)
    setSessionUrl(session.url)
  }

  useEffect(() => {
    ;(async () => {
      await getAppConfig()

      const subcription = await getMySubscription();
      const products =await getProducts();
      // if (subcription) {
      //   navigateToPage('PaymentScreen')
      // }
    })()
  }, [])
  // A function to handle changes to the input field
  const handleCouponValidation = async () => {
    if (couponCode.length <= 1) {
      toast.error('Please Enter Valid coupon Code')
      return
    }
    const couponValidation = await verifyCoupon(couponCode)
    if (couponValidation.ok) {
      setCouponValid(true)
      toast.success('Coupon Applied')
    } else {
      setCouponValid(false)
    }
    const response = await couponValidation.json()
    if (response) {
      setCouponInfo(response)
    }
  }
  const handleInputChange = (event) => {
    // Update the 'couponCode' state with the input's current value
    setCouponCode(event.target.value)
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
    <>
      {' '}
      {showConfirmationModal && (
        <ConfirmationModal
          show={showConfirmationModal}
          onConfirm={async () => {
            handleCreateSubscription()
            setShowConfirmationModal(false)
          }}
          onHide={() => {
            setShowConfirmationModal(false)
          }}
        />
      )}
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Select Your plan.</h1>
          <span>Enhance communication With Skoop.</span>
          <ul className="feature-list">
            <li>🎥 Video & Screen recordings</li>
            <li>✉️ Save Template Messages</li>
            <li>⚡ AI generated responses</li>
          </ul>
        </div>
        <svg width="315" height="1" viewBox="0 0 315 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line y1="0.5" x2="315" y2="0.5" stroke="black" stroke-opacity="0.2" />
        </svg>

        {couponValid && (couponInfo?.lifeTimeCoupon || couponInfo?.appSumoCoupon) ? (
          <></>
        ) : (
          <div className="subscription-options align-items-center">
            {!couponValid && <div className="subscription-option d-flex flex-row align-items-center bg-monthly">
              <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" checked={subscriptionType === 'freeTrial'} onChange={() => handleSubscriptionChange('freeTrial')} />
              <div className="ps-4">
                <h5>{appConfig.trial_period_days}-day Free trial</h5>
                <p>
                  Limited to {appConfig.max_videos} videos and {appConfig.max_prompts} AI responses.
                  <br />
                  No credit card Required .
                </p>
              </div>
            </div>}

            <div className="subscription-option d-flex flex-row align-items-center bg-monthly">
              <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" checked={subscriptionType === 'monthly'} onChange={() => handleSubscriptionChange('monthly')} />
              <div className="ps-4 pt-2">
                <h5>$ {discountedMonthlyPrice} Monthly</h5>
                {couponInfo && <p>Original Price : $ {monthlyPrice} /month</p>}
              </div>
            </div>
            <div className="subscription-option d-flex flex-row align-items-center bg-yearly">
              <div>
                <input class="form-check-input" type="checkbox" value="" id="circleCheckbox" checked={subscriptionType === 'yearly'} onChange={() => handleSubscriptionChange('yearly')} />
              </div>

              <div className="ps-4 pt-2">
                <h5>$ {discountedYearlyPrice} Yearly</h5>
                {couponInfo && <p>Original Price : $ {yearlyPrice} /year</p>}
              </div>
            </div>
          </div>
        )}
        {couponValid && (couponInfo?.lifeTimeCoupon || couponInfo?.appSumoCoupon) && (
          <div className="subscription-options align-items-center">
            <div className="subscription-option d-flex flex-row align-items-center bg-monthly">
              <div className="pt-2 text-center">
                <h5>Welcome,{couponInfo?.appSumoCoupon && 'AppSumo'} User!</h5>
                <p>Congratulations on activating your lifetime deal!</p>
              </div>
            </div>
          </div>
        )}
        <div className="d-flex flex-column">
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Have Coupon!" aria-label="Have Coupon!" value={couponCode} onChange={handleInputChange} />
            <span class="input-group-text cursor-pointer" id="basic-addon2" onClick={handleCouponValidation}>
              <FaCheckCircle color={!couponValid ? 'red' : 'green'} />
              {couponInfo && couponValid ? 'Applied' : 'Apply'}
            </span>
          </div>
          {couponInfo && couponValid && <span className="badge rounded-pill bg-warning text-dark ">Coupon Applied.</span>}
{couponValid && couponInfo?.discount?.trial_period  && <span className="badge rounded-pill bg-warning text-dark mt-1">Free trial For {couponInfo?.discount?.trial_period} days.</span>}
        </div>
        <div className="subscription-button d-grid gap-2 my-2">
          <button
            className="btn btn-primary btn-trial"
            type="button"
            onClick={() => {
              if (couponValid) {
                handleCreateSubscription()
              } else {
                setShowConfirmationModal(true)
              }
            }}
          >
            {subscriptionType === 'freeTrial' ? 'Start' : couponValid && (couponInfo?.lifeTimeCoupon || couponInfo?.appSumoCoupon) ? 'Activate' : 'Make Payment'}
          </button>
        </div>
        {subscriptionType === 'freeTrial' || (couponValid && (couponInfo?.lifeTimeCoupon || couponInfo?.appSumoCoupon)) ? (
          <></>
        ) : (
          <>
            <p className="small-bold-text">Credit Card/Debit Card information is required.</p>{' '}
            <p className="small-bold-text">
              <LockIcon />
              Guaranteed safe & secure checkout <img src="/images/stripe.png" />
            </p>
          </>
        )}
        {/* <br/> */}
      </div>
    </>
  )
}

export default SubscriptionScreen
