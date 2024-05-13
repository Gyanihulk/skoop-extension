import React, { useState, useEffect, useContext } from 'react'
import { FaAngleDown, FaArrowLeft } from 'react-icons/fa'
import API_ENDPOINTS from '../components/apiConfig'
import UserPreferencesForm from '../components/UserPreferencesForm'
import { toast } from 'react-hot-toast'
import AuthContext from '../contexts/AuthContext'
import ScreenContext from '../contexts/ScreenContext'

import { GrPowerReset } from 'react-icons/gr'
import BackButton from '../components/BackButton'
import Collapse from 'react-bootstrap/Collapse'
import PasswordTooltip from '../components/PasswordTooltip'
import GlobalStatesContext from '../contexts/GlobalStates'
import Link from 'next/link'

const AccountProfile = ({ userData }) => {
  // State for the profile image URL
  const [profileImage, setProfileImage] = useState(
    'https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-1023x1024-bve9uom6.png'
  )
  const { navigateToPage } = useContext(ScreenContext)
  useEffect(() => {
    if (userData.image_path) {
      setProfileImage(
        userData.image_path.startsWith('public')
          ? API_ENDPOINTS.backendUrl + '/' + userData.image_path
          : userData.image_path
      )
    }
  }, [userData])
  // Function to handle the file input change event
  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append('profileImage', file)

      try {
        const res = await fetch(API_ENDPOINTS.updateProfileImage, {
          method: 'PATCH',
          body: formData, // Use FormData here
          headers: {
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem('accessToken')
            )}`,
            // Remove 'Content-Type' header when using FormData
          },
        })

        if (res.ok) {
          const jsonResponse = await res.json()
          setProfileImage(
            API_ENDPOINTS.backendUrl + '/' + jsonResponse.image_path
          ) // Access image_path from JSON response
          toast.success('Profile Image Updated')
        } else throw new Error('Error in the database')
      } catch (err) {
        toast.error('Profile Image Not Updated, try Again')
      }
    }
  }

  // Function to trigger the file input when the image is clicked
  const triggerFileInput = () => {
    document.getElementById('fileInput').click()
  }

  return (
    <div className="lighter-pink">
      <div className="mb-2 pt-3">
        <BackButton navigateTo="Home" />
      </div>
      <div className=" border-bottom-light-pink p-3">
        <div className="card-body">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2">
              <img
                src={profileImage}
                className="rounded-circle rounded-circle-custom"
                onClick={triggerFileInput}
                alt="Profile"
              />
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div>
                <h4 className="profile-name">{userData.full_name}</h4>
                <h6 className="profile-text-sm">{userData.email}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: '',
    confirm: '',
    oldPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [toggleInfo, setToggleInfo] = useState(false)
  const [showOldPasswordTooltip, setShowOldPasswordTooltip] = useState(false)
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false)
  const [showConfirmPasswordTooltip, setShowConfirmPasswordTooltip] =
    useState(false)

  function validatePassword(password) {
    const uppercaseRegex = /[A-Z]/
    const lowercaseRegex = /[a-z]/
    const specialCharRegex = /[!@#$%^&*]/
    const numericRegex = /[0-9]/

    const isUppercase = uppercaseRegex.test(password)
    const isLowercase = lowercaseRegex.test(password)
    const isSpecialChar = specialCharRegex.test(password)
    const isNumeric = numericRegex.test(password)
    const isLengthValid = password.length >= 8 && password.length <= 16

    return (
      isUppercase && isLowercase && isSpecialChar && isNumeric && isLengthValid
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'oldPassword') {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }))
      setShowOldPasswordTooltip(!validatePassword(value))
    }
    if (name === 'password') {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }))
      setShowPasswordTooltip(!validatePassword(value))
    }
    if (name === 'confirm') {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }))
      setShowConfirmPasswordTooltip(!validatePassword(value))
    }
  }

  const handleFocus = (event) => {
    const { name } = event.target
    if (name === 'oldPassword') {
      setShowOldPasswordTooltip(true)
    }
    if (name === 'password') {
      setShowPasswordTooltip(true)
    }
    if (name === 'confirm') {
      setShowConfirmPasswordTooltip(true)
    }
  }

  const handleBlur = () => {
    setShowOldPasswordTooltip(false)
    setShowPasswordTooltip(false)
    setShowConfirmPasswordTooltip(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (values.password !== values.confirm) {
      toast.error('New password doesnt match.')
      return
    }
    try {
      const res = await fetch(API_ENDPOINTS.changePassword, {
        method: 'PATCH',
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.password,
        }),
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (res.ok) {
        toast.success('Password Changed')
        setValues({
          password: '',
          confirm: '',
          oldPassword: '',
        })
      } else throw 'error in the database'
    } catch (err) {
      toast.error('Password Not Updated, try Again')
    }
  }

  return (
    <div
      className={`card border-radius-12 ${
        !toggleInfo ? 'overflow-hidden' : ''
      } `}
    >
      <div
        className="light-pink card-header-custom toggle-collapse"
        onClick={() => setToggleInfo(!toggleInfo)}
        aria-expanded={toggleInfo}
        aria-controls="change-password-collapse"
      >
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 card-title">Change password</h6>
          <div>
            <FaAngleDown
              style={
                toggleInfo
                  ? { transform: 'rotate(180deg)' }
                  : { transform: 'rotate(0deg)' }
              }
            />
          </div>
        </div>
      </div>
      <Collapse in={toggleInfo}>
        <div id="change-password-collapse">
          <form onSubmit={handleSubmit}>
            <div className="card-body p-0">
              <div className="container my-3">
                <div className="row">
                  <div className="col-sm-6 mb-2 password-with-tooltip">
                    <div className="position-relative password-with-tooltip">
                      <div className="form-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control custom-input-global"
                          id="oldPassword"
                          name="oldPassword"
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          value={values.oldPassword}
                          placeholder="Current password"
                          required
                        />
                      </div>
                      {showOldPasswordTooltip && <PasswordTooltip />}
                    </div>
                  </div>

                  <div className="col-sm-6 mb-2">
                    <div className="position-relative password-with-tooltip">
                      <div className="form-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control custom-input-global"
                          id="password"
                          name="password"
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          value={values.password}
                          placeholder="New password"
                          required
                        />
                      </div>
                      {showPasswordTooltip && <PasswordTooltip />}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="position-relative password-with-tooltip">
                      <div className="form-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control custom-input-global"
                          id="confirm"
                          name="confirm"
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          value={values.confirm}
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                      {showConfirmPasswordTooltip && <PasswordTooltip />}
                    </div>
                  </div>
                </div>
                <div className="mt-4 d-flex justify-content-end">
                  <button type="submit" className="card-btn">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Collapse>
    </div>
  )
}

const CalendarUrlForm = ({ userProfileData }) => {
  const [calendarUrl, setCalendarUrl] = useState('')
  const [toggleInfo, setToggleInfo] = useState(false)
  const [preferences, setPreferences] = useState([])
  const [showResetButton, setshowResetButton] = useState(false)
  const { getCalendarUrl, getUserPreferences } = useContext(AuthContext)

  const checkForDefaultUrl = async (url) => {
    if (userProfileData && userProfileData.email && url) {
      const userEmail = userProfileData.email.split('@')
      const defaultUrl = `https://skoopcrm.sumits.in/booking?email=${encodeURIComponent(
        userEmail[0]
      )}%40${encodeURIComponent(userEmail[1])}`
      if (!url.startsWith(defaultUrl)) {
        setshowResetButton(true)
      } else {
        setshowResetButton(false)
      }
    } else {
      console.log('userdata not found')
    }
  }

  const getData = async () => {
    const preference = await getUserPreferences()
    setPreferences(preference)
    const url = await getCalendarUrl()
    setCalendarUrl(url)
    checkForDefaultUrl(url)
  }

  useEffect(() => {
    getData()
  }, [userProfileData])

  const handleChange = (event) => {
    setCalendarUrl(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch(API_ENDPOINTS.updateCalendarUrl, {
        // Replace with your API endpoint
        method: 'POST',
        body: JSON.stringify({ calendarUrl }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
        },
      })
      const data = await res.text()
      if (res.ok) {
        toast.success('Calendar link updated successfully')
        const url = await getCalendarUrl()
        setCalendarUrl(url)
        checkForDefaultUrl(url)
      } else {
        throw new Error(data.message || 'Error saving calendar URL')
      }
    } catch (err) {
      toast.error(
        err.message || 'Failed to update calendar link. Please try again.'
      )
    }
  }

  const resetAppointmentLink = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.resetBookingUrl, {
        // Replace with your API endpoint
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
        },
      })

      const url = await res.text()
      if (res.ok) {
        toast.success('Calendar link reset successfully')
        setCalendarUrl(url)
        checkForDefaultUrl(url)
      } else {
        throw new Error(data.message || 'Error reseting calendar URL')
      }
    } catch (err) {
      toast.error(
        err.message || 'Failed to reset calendar url. Please try again.'
      )
    }
  }

  return (
    <div className="card border-radius-12 overflow-hidden">
      <div
        className="light-pink card-header-custom d-flex justify-content-between align-items-center"
        onClick={() => setToggleInfo(!toggleInfo)}
        aria-expanded={toggleInfo}
        aria-controls="appointment-collapse"
      >
        <h6 className="mb-0 card-title">Appointment booking link</h6>
        <div>
          <FaAngleDown
            style={
              toggleInfo
                ? { transform: 'rotate(180deg)' }
                : { transform: 'rotate(0deg)' }
            }
          />
        </div>
      </div>
      <Collapse in={toggleInfo}>
        <div id="appointment-collapse">
          <form onSubmit={handleSubmit}>
            <div className="card-body p-0">
              <div className="container my-3">
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="calendarUrl"
                      className="form-label profile-text"
                    >
                      Your Appointment Booking Link
                    </label>
                    {showResetButton && (
                      <GrPowerReset
                        className="ms-1"
                        onClick={resetAppointmentLink}
                      />
                    )}
                  </div>
                  <input
                    type="text"
                    className="form-control mt-3 custom-input-global"
                    id="calendarUrl"
                    name="calendarUrl"
                    value={calendarUrl}
                    onChange={handleChange}
                    placeholder="Enter your calendar link"
                    required
                  />
                </div>
                <div
                  className={`mt-1 d-flex ${
                    preferences?.length == 0
                      ? 'justify-content-between'
                      : 'justify-content-end'
                  }`}
                >
                  {preferences?.length == 0 && (
                    <div className="d-flex flex-wrap">
                      <span className="badge badge-info d-flex align-items-center justify-content-start text-danger text-wrap">
                        User appointment preferences not set.
                      </span>
                    </div>
                  )}
                </div>
                <div
                  class="mt-2 d-flex justify-content-end
    "
                >
                  <button type="submit" class="card-btn">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Collapse>
    </div>
  )
}
const UserSubscriptions = () => {
  const [toggleInfo, setToggleInfo] = useState(false)
  const { getMySubscription, deactivateMySubscription } =
    useContext(AuthContext)
  const [subsriptionInfo, setSubscriptionInfo] = useState()
  async function setup() {
    const response = await getMySubscription()
    setSubscriptionInfo(response)
  }
  useEffect(() => {
    setup()
  }, [])
  async function handleCancel() {
    deactivateMySubscription()
  }
  return (
    <div className="card border-radius-12 overflow-hidden">
      <div
        className="light-pink card-header-custom d-flex justify-content-between align-items-center"
        onClick={() => setToggleInfo(!toggleInfo)}
        aria-expanded={toggleInfo}
        aria-controls="subscription-collapse"
      >
        <h6 className="mb-0 card-title">Subscription</h6>
        <div>
          <FaAngleDown
            style={
              toggleInfo
                ? { transform: 'rotate(180deg)' }
                : { transform: 'rotate(0deg)' }
            }
          />
        </div>
      </div>
      <Collapse in={toggleInfo}>
        <div className="collapse" id="subscription-collapse">
          <div class="container my-3">
            {subsriptionInfo?.id && (
              <>
                <div class="subscription-card-header d-flex justify-content-between">
                  <h3>{subsriptionInfo?.current_plan_status}</h3>{' '}
                  <span class="badge badge-active ml-2">Active</span>
                </div>

                <ul class="list-group">
                  <li class="d-flex justify-content-start align-items-center mt-2 mysubscription-info bold-600">
                    Plan details
                  </li>
                  <li class="d-flex justify-content-between align-items-center mysubscription-info">
                    Subscription ID
                    <span>{subsriptionInfo?.subscription_id}</span>
                  </li>
                  <li class="d-flex justify-content-between align-items-center mysubscription-info">
                    Plan
                    <span>{subsriptionInfo?.plan_type}</span>
                  </li>

                  <li class="d-flex justify-content-between align-items-center mysubscription-info">
                    Start date
                    <span>{subsriptionInfo?.start_date}</span>
                  </li>
                  <li class="d-flex justify-content-between align-items-center mysubscription-info">
                    Expiration date
                    <span>{subsriptionInfo?.expiration_date}</span>
                  </li>
                  <li class="d-flex justify-content-end align-items-center mt-1">
                    {/* <div className="cancel-subscription">View Payment</div> */}
                    <div
                      className="cancel-subscription"
                      onClick={() => {
                        handleCancel()
                      }}
                    >
                      Cancel Subscription
                    </div>
                  </li>
                </ul>
              </>
            )}
          </div>{' '}
        </div>
      </Collapse>
    </div>
  )
}
function AccountSettings(props) {
  const [profileData, setProfileData] = useState({})

  const handleProfileUpdate = (newProfileData) => {
    setProfileData((prevData) => ({
      ...prevData,
      ...newProfileData,
    }))
  }

  const getProfileDetails = async () => {
    try {
      var response = await fetch(API_ENDPOINTS.profileDetails, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      response = await response.json()
      const fullName = response.full_name.split(' ')
      response.firstName = fullName[0]
      response.lastName = fullName[1]
      setProfileData(response)
      return response
    } catch (err) {
      console.log('could not get profile details', err)
    }
  }

  useEffect(() => {
    ;(async () => {
      await getProfileDetails()
    })()
  }, [])

  const { isTimezoneScreen, setIsTimezoneScreen } =
    useContext(GlobalStatesContext)

  const openNewWindow = (url) => {
    document.body.style.overflow = 'auto'
    window.open(url, '_blank')
  }
  return (
    <>
      <div id="account-settings">
        <div className="pb-2">
          <div>
            {!isTimezoneScreen && <AccountProfile userData={profileData} />}
          </div>
          <div className="mt-4 mx-3">
            {!isTimezoneScreen && (
              <>
                <div>
                  {profileData && (
                    <UserSubscriptions userProfileData={profileData} />
                  )}
                </div>
                <div className="mt-3">
                  {profileData && (
                    <CalendarUrlForm userProfileData={profileData} />
                  )}
                </div>
                <div className="mt-3">
                  <SettingsPassword />
                </div>
              </>
            )}
            <div className="mt-3 mb-3-0">
              <UserPreferencesForm />
            </div>
            <div className="fixed-bottom mt-2 cursor-pointer d-flex flex-col auth-footer-label justify-content-center">
              <div
                onClick={() =>
                  openNewWindow(
                    API_ENDPOINTS.skoopCalendarUrl + '/privacypolicy'
                  )
                }
              >
                Privacy Policy
              </div>{' '}
              &nbsp;|&nbsp;
              <div
                onClick={() =>
                  openNewWindow(API_ENDPOINTS.skoopCalendarUrl + '/termsofuse')
                }
              >
                Terms of Use
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountSettings
