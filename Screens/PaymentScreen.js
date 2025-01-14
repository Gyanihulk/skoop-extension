import React, { useContext, useEffect } from 'react'
import AuthContext from '../contexts/AuthContext'
import ScreenContext from '../contexts/ScreenContext'

export const PaymentScreen = () => {
  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="confirmation-container text-center">
            <img className="credit-card" src="/images/credit-card.png" alt="credit card" />
            <div class="confirmation-title">Please complete Payment!</div>
            <p>Please add your card details to sucessfully complete activation of account for SKOOP application.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
