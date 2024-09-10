import React, { useContext } from 'react'
import { ThankYouTick } from '../components/SVG/ThankYouTick'
import ScreenContext from '../contexts/ScreenContext'
import GlobalStatesContext from '../contexts/GlobalStates'
import { capitalizeWords } from '../lib/helpers'
import AuthContext from '../contexts/AuthContext'

export const ThankYouScreen = () => {
  const { navigateToPage } = useContext(ScreenContext)
  const { subscriptionType } = useContext(AuthContext)
  const today = new Date()

  const threeDaysFromToday = new Date(today.setDate(today.getDate() + 3))
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  const startDate = threeDaysFromToday.toLocaleDateString('en-US', options)

  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="confirmation-container text-center">
            <ThankYouTick />
            <div class="confirmation-title">Subscription Confirmed!</div>
            <p>Congratulations! You have successfully activated your account.</p>
            {/* <p>Subscription starts charging from {startDate}</p> */}
            <button onClick={() => navigateToPage('CalendarSync')} class="btn btn-primary btn-trial w-100">
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
