import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../contexts/AuthContext'
import { FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import GlobalStatesContext from '../contexts/GlobalStates'
import { LockIcon } from '../components/SVG/LockIcon'
import ScreenContext from '../contexts/ScreenContext'
const SubscriptionScreen = () => {
  const { createSubscription, verifyCoupon, getMySubscription } =
    useContext(AuthContext)
  const { subscriptionType, setSubscriptionType } =
    useContext(GlobalStatesContext)
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
      subsData.coupon = couponCode
    }
    const session = await createSubscription(subsData)
    setSessionUrl(session.url)
  }

  const { navigateToPage } = useContext(ScreenContext)
  useEffect(() => {
    (async () => {
      const subcription = await getMySubscription()
      if (subcription) {
        navigateToPage('PaymentScreen')
      }
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
  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Start your 3-day free trial.</h1>
        <span>Unlock all the premium benfits now.</span>
        <ul className="feature-list">
          <li>🔓 Accessibility to all features</li>
          <li>✉️ Send unlimited messages</li>
          <li>⚡ Faster AI generated responses</li>
        </ul>
      </div>
      <svg
        width="315"
        height="1"
        viewBox="0 0 315 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line y1="0.5" x2="315" y2="0.5" stroke="black" stroke-opacity="0.2" />
      </svg>

      <div className="subscription-options align-items-center">
        <div className="subscription-option d-flex flex-row align-items-center bg-monthly">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="circleCheckbox"
            checked={subscriptionType === 'monthly'}
            onChange={() => handleSubscriptionChange('monthly')}
          />
          <div className="ps-4 pt-2">
            <h5>Monthly</h5>
            <p>
              First 3 days free, then $
              {couponInfo && subscriptionType === 'monthly'
                ? couponInfo?.discount?.percent_off
                  ? (
                      (47 * (100 - couponInfo?.discount?.percent_off)) /
                      100
                    ).toFixed(2)
                  : couponInfo?.discount?.amount_off
                  ? (47 - couponInfo?.discount?.amount_off).toFixed(2)
                  : 47
                : 47}
              /month
            </p>
          </div>
        </div>
        <div className="subscription-option d-flex flex-row align-items-center bg-yearly">
          <div>
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="circleCheckbox"
              checked={subscriptionType === 'yearly'}
              onChange={() => handleSubscriptionChange('yearly')}
            />
          </div>

          <div className="ps-4 pt-2">
            <h5>
              Yearly{' '}
              <span className="badge rounded-pill bg-warning text-dark">
                SAVE 20%{' '}
              </span>
            </h5>
            <p>
              First 3 days free, then $
              {couponInfo && subscriptionType === 'yearly'
                ? couponInfo?.discount?.percent_off
                  ? (
                      (451 * (100 - couponInfo?.discount?.percent_off)) /
                      100
                    ).toFixed(2)
                  : couponInfo?.discount?.amount_off
                  ? (451 - couponInfo?.discount?.amount_off).toFixed(2)
                  : 451
                : 451}
              /year
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Have Coupon!"
            aria-label="Have Coupon!"
            value={couponCode}
            onChange={handleInputChange}
          />
          <span
            class="input-group-text cursor-pointer"
            id="basic-addon2"
            onClick={handleCouponValidation}
          >
            <FaCheckCircle color={!couponValid ? 'red' : 'green'} />
            Apply
          </span>
        </div>
        {couponInfo && couponValid && (
          <span className="badge rounded-pill bg-warning text-dark ">
            Coupon Applied.
          </span>
        )}
      </div>

      <div className="subscription-button d-grid gap-2 my-2">
        <button
          className="btn btn-primary btn-trial"
          type="button"
          onClick={handleCreateSubscription}
        >
          START 3-DAY FREE TRIAL
        </button>
      </div>
      <p className="small-bold-text">
        Credit Card/Debit Card information is required.
      </p>
      {/* <br/> */}
      <p className="small-bold-text">
        <LockIcon />
        Guaranteed safe & secure checkout <img src="/images/stripe.png" />
      </p>
    </div>
  )
}

export default SubscriptionScreen
