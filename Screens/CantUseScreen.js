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
            <div class="confirmation-title mt-3">Important Notice!</div>
            <div class="alert alert-warning" role="alert">
              This extension is versatile and designed for screen and video recording communication across all tabs. Easily access the recording features by clicking on the dedicated button located at the top right corner of any tab you're browsing.
              Whether you're on LinkedIn, Gmail, or any other site, our extension is ready to assist you with your recording needs for effective networking and communication.
            </div>
            <img className="work-in-progress mt-3" src={isLinkedin ? '/images/linkedIn.png' : '/images/gmail.png'} alt="work progress" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CantUseScreen
