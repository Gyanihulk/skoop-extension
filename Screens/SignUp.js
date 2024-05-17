import React, { useState, useContext, useEffect } from 'react'
import ContinueWithLinkedInButton from '../components/Auth/button/ContinueWithLinkedInButton'
import ContinueWithGoogleButton from '../components/Auth/button/ContinueWithGoogleButton'

import ScreenContext from '../contexts/ScreenContext'
import AuthContext from '../contexts/AuthContext'
import CustomButton from '../components/Auth/button/CustomButton'
import ValidationError from '../components/Auth/ValidationError'
import CustomInputBox from '../components/Auth/CustomInputBox'
import CustomPasswordInputBox from '../components/Auth/CustomPasswordInputBox'
import { MdExpandMore } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { IoSearchOutline } from 'react-icons/io5'
import { IoCheckmark } from 'react-icons/io5'
import { timezones } from '../lib/timezones'
import PasswordTooltip from '../components/PasswordTooltip'
import API_ENDPOINTS from '../components/apiConfig'
import RemoveSessions from '../components/Auth/RemoveSessions'

const SignUp = () => {
  const { handleRegister, validatePassword,showClearSessionDialog ,deleteMyAllJwtSessionsBySocial,social,setSocial } = useContext(AuthContext)
  const { navigateToPage } = useContext(ScreenContext)
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false)
  const [isFullnameEmpty, setIsFullnameEmpty] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)
  const [isTimezoneEmpty, setIsTimezoneEmpty] = useState(false)
  const [isTimezoneScreen, setIsTimezoneScreen] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [myTimezone, setMyTimezone] = useState('')
  const [filteredTimezones, setFilteredTimezones] = useState(timezones)

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setMyTimezone(detectedTimezone)
    setSelectedTimezone(detectedTimezone)
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'fullname') {
      setFullname(value)
      setIsFullnameEmpty(value.trim() === '')
    } else if (name === 'email') {
      setEmail(value)
      setIsEmailEmpty(value.trim() === '')
    } else if (name === 'password') {
      setShowPasswordTooltip(!validatePassword(value.trim()))
      setPassword(value)
      setIsPasswordEmpty(value.trim() === '')
    } else if (selectedTimezone === '') {
      setIsTimezoneEmpty(true)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      fullname.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      selectedTimezone !== ''
    ) {
      handleRegister(fullname, email, password, selectedTimezone)
    } else {
      setIsFullnameEmpty(fullname.trim() === '')
      setIsEmailEmpty(email.trim() === '')
      setIsPasswordEmpty(password.trim() === '')
      setIsTimezoneEmpty(selectedTimezone === '')
    }
  }

  const handleFocus = () => {
    setShowPasswordTooltip(true)
  }

  const handleBlur = () => {
    setShowPasswordTooltip(false)
  }

  const handleToggleTimezoneScreen = () => {
    setIsTimezoneScreen(!isTimezoneScreen)
  }

  const onCloseTimezoneScreen = () => {
    setIsTimezoneScreen(!isTimezoneScreen)
    setSelectedTimezone(myTimezone)
  }

  const handleSelectTimezone = (timezone) => {
    setSelectedTimezone(timezone)
  }

  const handleTimezoneSubmit = () => {
    setMyTimezone(selectedTimezone)
    setIsTimezoneEmpty(false)
    setFilteredTimezones(timezones)
    handleToggleTimezoneScreen()
  }

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase()
    const filtered = timezones.filter((timezone) =>
      timezone.toLowerCase().includes(query)
    )
    setFilteredTimezones(filtered)
  }
  const openNewWindow = (url) => {
    document.body.style.overflow = 'auto'
    window.open(url, '_blank')
  }
 
  function handleDeleteSessions(){
    deleteMyAllJwtSessionsBySocial(social);
  }
  return (
    <div>
      {!isTimezoneScreen ? (
        <div className="sign-up-main container px-4 pt-4">
          <div className="mb-3 auth-head-content">
            <h1>Create your Skoop account</h1>
            <p>
              It's time to get more clients and contact again with old
              connections
            </p>
          </div>
          <div className="mt-3">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <div>
                      <CustomInputBox
                        type="text"
                        placeholder="Full name"
                        name="fullname"
                        onChange={handleChange}
                        value={fullname}
                        isEmpty={isFullnameEmpty}
                      />
                      {isFullnameEmpty && (
                        <ValidationError title="Please enter your name" />
                      )}
                    </div>
                    <div>
                      <CustomInputBox
                        type="email"
                        placeholder="Email address"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        isEmpty={isEmailEmpty}
                      />
                      {isEmailEmpty && (
                        <ValidationError title="Please enter your email address" />
                      )}
                    </div>
                  </div>

                  <div className="password-with-tooltip">
                    <div className="form-group">
                      <CustomPasswordInputBox
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={password}
                        isEmpty={isPasswordEmpty}
                      />
                      {isPasswordEmpty && (
                        <ValidationError title="Please enter your password" />
                      )}
                    </div>
                    {showPasswordTooltip && <PasswordTooltip />}
                  </div>
                  <div>
                    <div
                      className="position-relative"
                      onClick={handleToggleTimezoneScreen}
                    >
                      <input
                        className="mt-3 form-control cursor-pointer"
                        id="time-zone-dropdown"
                        type="text"
                        name="timezone"
                        placeholder="Select time zone"
                        value={myTimezone}
                        readOnly
                      />
                      <button
                        className="btn position-absolute end-0 top-50 translate-middle-y border-0"
                        type="button"
                      >
                        <MdExpandMore size={16} />
                      </button>
                    </div>
                    {isTimezoneEmpty && (
                      <ValidationError title="Please select timezone" />
                    )}
                  </div>

                  <div className="mt-4">
                    <CustomButton type="Submit" child="Sign Up" />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div>
            <p className="mt-2 sign-up-privacy-policy">
              By clicking submit you are agreeing to{' '}
              <span
                className="cursor-pointer fw-bold footer-font"
                onClick={() =>
                  openNewWindow(
                    API_ENDPOINTS.skoopCalendarUrl + '/privacypolicy'
                  )
                }
              >
                Privacy policies
              </span>{' '}
              &{' '}
              <span
                className="cursor-pointer fw-bold footer-font"
                onClick={() =>
                  openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/termsofuse')
                }
              >
                Terms of use
              </span>
            </p>
          </div>
          <div className="mt-4">
            <div className="text-center mb-3 or-with-label">
              <span>or Sign up with</span>
            </div>
            {showClearSessionDialog && social!=null && <RemoveSessions onDelete={handleDeleteSessions}/>}
            <ContinueWithLinkedInButton setSocial={setSocial} message="Sign up with LinkedIn" />
            <ContinueWithGoogleButton setSocial={setSocial} message="Sign up with Google"/>
            <div className="text-center mt-2 auth-footer-label">
              Already have an account?{' '}
              <span
                onClick={() => navigateToPage('SignIn')}
                className="cursor-pointer fw-bold footer-font"
              >
                Login
              </span>
            </div>
            <div className="text-center mt-2 auth-footer-label">
          <span
            onClick={()=>openNewWindow(
              API_ENDPOINTS.skoopCalendarUrl + '/affiliate/sign-up'
            )}
            className="cursor-pointer fw-bold footer-font"
          >
            Become an affiliate.
          </span>
        </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 px-4 time-zone-main">
          <div className="timezone-head d-flex justify-content-between">
            <h2>Select time zone</h2>
            <RxCross2
              className="cursor-pointer"
              size={20}
              color="#2C2D2E"
              onClick={onCloseTimezoneScreen}
            />
          </div>
          <div className="position-relative custom-password-input-box">
            <input
              type="text"
              className="form-control mt-2"
              id="timezone-search-input-box"
              placeholder="Search"
              onChange={handleSearch}
            />
            <button
              className="btn position-absolute ps-3 top-50 translate-middle-y border-0"
              type="button"
            >
              <IoSearchOutline />
            </button>
          </div>

          <div className="mt-2" id="timezone-list-container">
            {filteredTimezones.map((timezone, index) => (
              <div>
                <div
                  onClick={() => handleSelectTimezone(timezone)}
                  className={`px-2 timezone-item cursor-pointer`}
                  id={`${
                    selectedTimezone === timezone ? 'selected-timezone' : ''
                  }`}
                  key={index}
                >
                  <div>{timezone}</div>
                  {selectedTimezone === timezone && <IoCheckmark size={16} />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <CustomButton child="Submit" onClick={handleTimezoneSubmit} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUp
