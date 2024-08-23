import React, { useContext, useState } from 'react'
import ScreenContext from '../contexts/ScreenContext'
import CustomButton from '../components/Auth/button/CustomButton'
import AuthContext from '../contexts/AuthContext'
import CustomInputBox from '../components/Auth/CustomInputBox'
import toast from 'react-hot-toast'

const Welcome = () => {
  const { navigateToPage } = useContext(ScreenContext)
  
  const {  verifyCoupon,coupon, setCoupon,setCouponInfo,setCouponValid,setSubscriptionType} = useContext(AuthContext)
  const handleGetStarted = () => {
    navigateToPage('SignUp')
    localStorage.setItem('welcomePageShown', true)
  }
  const validateCoupon = async() => {
   console.log(coupon)
   if (coupon.length <= 4) {
    toast.error('Please Enter Valid coupon Code')
    return
  }
  const couponValidation = await verifyCoupon(coupon)

  if (couponValidation.ok) {

    toast.success('Coupon Is Valid')
    const response = await couponValidation.json()
    console.log(couponValidation,response)
    // navigateToPage('Welcome')
    setCouponInfo(response)
    setCouponValid(true)
    
    if(response?.appSumoCoupon){
      setSubscriptionType("appsumo")
      navigateToPage("WelcomeAppsumo")
    }else if(response?.stripeCoupon){
      navigateToPage("WelcomeStripe")
    }
  } 
 
 
  }
  
  return (
    <div className="welcome-main">
      <div className="welcome-image-container">
        <img src="/screens/welcome.png" alt="Welcome" />
       
      </div>
     
      <div className="logo-image-container">
        <div className="logo-content">
          <img src="/screens/logo.png" alt="Skoop" />
         
          <h3 className="welcome-title">Skoop</h3>
          <div className="app-version">
          <p>Version 1.1.0</p>
        </div>
          <div className="welcome-content">
            <p className="welcome-desc">Increase your client engagement to gain more revenue</p>
            <div className="w-100 get-started-btn">
              <CustomInputBox type="text" placeholder="Enter Coupon Code" name="coupon" onChange={(e) => setCoupon(e.target.value)} value={coupon} isEmpty={'isUsernameEmpty'} />
              <div className="mt-2">
                <CustomButton child="Validate Your Coupon" onClick={validateCoupon} />
              </div>
            </div>
          </div>
          <div className="mt-4 welcome-content">
            <div className="w-100 get-started-btn">
              <CustomButton child="Get Started Without Coupon" onClick={handleGetStarted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
