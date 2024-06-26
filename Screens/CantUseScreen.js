import React, { useContext, useEffect, useState } from 'react'
import GlobalStatesContext from '../contexts/GlobalStates'

const CantUseScreen = () => {
  let { isLinkedin, setIsLinkedin } = useContext(GlobalStatesContext)
  useEffect(() => {
    chrome.tabs.query({}, function (tabs) {
      // Set the retrieved tabs to state
      const targetTab = tabs.find((tab) => tab.active)
      if (targetTab.url) {
        if (targetTab.url.includes('https://www.linkedin.com')) {
          setIsLinkedin(true)
        }
      }
    })
  }, [])
  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="py-4 text-center">
            <img className="work-in-progress mt-3" src={isLinkedin ? '/images/linkedIn.png' : '/images/gmail.png'} alt="work progress" />
            <div class="confirmation-title mt-3">Important Notice!</div>
            <div class="alert alert-warning" role="alert">
              This extension is solely compatible with LinkedIn and Gmail for networking purposes. Access the networking feature through the dedicated button on the top right of the respective LinkedIn and Gmail pages.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CantUseScreen
