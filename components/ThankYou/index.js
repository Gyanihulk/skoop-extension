import React, { useContext } from 'react'
import { ThankYouTick } from '../../components/SVG/ThankYouTick'
import ScreenContext from '../../contexts/ScreenContext'

export default function ThankYou({ heading, pageToRedirect, redirectPageText, children }) {
  const { navigateToPage } = useContext(ScreenContext)
  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="confirmation-container text-center">
            <ThankYouTick />
            <div class="confirmation-title">{heading}</div>
            {children}
            <button onClick={() => navigateToPage(pageToRedirect)} class="btn btn-primary btn-trial w-100">
              {redirectPageText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
