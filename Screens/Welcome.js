import React, { useContext } from 'react'
import ScreenContext from '../contexts/ScreenContext'
import CustomButton from '../components/Auth/button/CustomButton'
import AuthContext from '../contexts/AuthContext'

const Welcome = () => {
  const { navigateToPage } = useContext(ScreenContext)
  const { version } = useContext(AuthContext)
  const handleGetStarted = () => {
    navigateToPage('SignUp')
    localStorage.setItem('welcomePageShown', true)
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

          <div className="welcome-content">
            <p className="welcome-desc">Increase your client engagement to gain more revenue</p>
            <div className="w-100 get-started-btn">
              <CustomButton child="Get started" onClick={handleGetStarted} />
            </div>
          </div>
        </div>

        <div className="app-version">
          <p>Version 1.0.6</p>
        </div>
      </div>
    </div>
  )
}

export default Welcome
