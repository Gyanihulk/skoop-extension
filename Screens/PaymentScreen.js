import React from 'react'

export const PaymentScreen = () => {
  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="confirmation-container text-center">
            <img  className='credit-card' src="/images/credit-card.png" alt="credit card" />
            <div class="confirmation-title">Please complete Payment!</div>
            <p>
              Please add you card details to sucessfully complete the free trial
              process of skoop application.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
