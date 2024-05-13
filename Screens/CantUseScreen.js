import React, { useEffect, useState } from 'react'


const CantUseScreen = () => {
  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="confirmation-container text-center">
            <img
              className="credit-card"
              src="/images/work-progress.png"
              alt="work progress"
            />
            <div class="confirmation-title">Important Notice!</div>
            <p>
              Currently, this extension is exclusively for use with LinkedIn and
              Gmail accounts.
            </p>
            <div class="alert alert-warning" role="alert">
              We are actively working on expanding the extension's compatibility
              to include other websites and platforms. Stay tuned for updates!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CantUseScreen
