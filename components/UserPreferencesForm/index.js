import React, { Component, useEffect, useContext, useState, useRef } from 'react'
import { FaAngleDown, FaRegClock, FaMicrosoft } from 'react-icons/fa'
import API_ENDPOINTS from '../apiConfig'
import { toast } from 'react-hot-toast'
import { timezones } from '../../lib/timezones'
import { isStartTimeBeforeEndTime, convertTo12HrTime, convertToMinutes } from '../../lib/helpers'
import { MdExpandMore } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { IoSearchOutline } from 'react-icons/io5'
import { IoCheckmark } from 'react-icons/io5'
import { FcGoogle } from 'react-icons/fc'
import AuthContext from '../../contexts/AuthContext'
import ValidationError from '../../components/Auth/ValidationError'
import TimePicker from 'react-bootstrap-time-picker'
import { timeFromInt, timeToInt } from 'time-number'
import ScreenContext from '../../contexts/ScreenContext'
import Collapse from 'react-bootstrap/Collapse'
import GlobalStatesContext from '../../contexts/GlobalStates'
import CustomButton from '../Auth/button/CustomButton'

const UserPreferencesForm = ({ heading, collapse = false, showSkip }) => {
  const [values, setValues] = useState({
    preferredStartTime: '',
    preferredEndTime: '',
    timeZone: '',
    additionalDetails: '',
    breakStartTime: '',
    breakEndTime: '',
  })
  const [isPreference, setIsPreference] = useState(false)
  const [userPreferences, setUserPreferences] = useState(null)
  const [toggleInfo, setToggleInfo] = collapse ? useState(collapse) : useState(false)
  const [isTimezoneEmpty, setIsTimezoneEmpty] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [google, setGoogle] = useState(false)
  const [microsoft, setMicrosoft] = useState(false)
  const [preferredStartTime, setPreferredStartTime] = useState('08:00:00')
  const [preferredEndTime, setPreferredEndTime] = useState('17:00:00')
  const [breakStartTime, setBreakStartTime] = useState('12:00:00')
  const [breakEndTime, setBreakEndTime] = useState('13:00:00')
  const [timeZone, setTimeZone] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [myTimezone, setMyTimezone] = useState('')
  const [filteredTimezones, setFilteredTimezones] = useState(timezones)
  const [toggleBreakTimes, setToggleBreakTimes] = useState(true)
  const [toggleAdditionalDetails, setToggleAdditionalDetails] = useState(true)
  const { getUserPreferences, calendarSync, setNewUser, userProfileDetail, getUserProfileDetail } = useContext(AuthContext)
  const inputRef = useRef()

  const { isTimezoneScreen, setIsTimezoneScreen } = useContext(GlobalStatesContext)
  const { navigateToPage, activePage } = useContext(ScreenContext)

  const handleSwitchChange = (event) => {
    if (event.target.name === 'toggle-break-times') {
      setToggleBreakTimes(event.target.checked)
    }
    if (event.target.name === 'toggle-additional-details') {
      setToggleAdditionalDetails(event.target.checked)
    }
  }

  const initializePreferedTime = () => {
    let startTime = timeToInt(preferredStartTime)
    let endTime = timeToInt(preferredEndTime)
    let breakTimestart = timeToInt(breakStartTime)
    let breakTimeEnd = timeToInt(breakEndTime)

    setPreferredStartTime(startTime)
    setPreferredEndTime(endTime)
    setBreakStartTime(breakTimestart)
    setBreakEndTime(breakTimeEnd)
  }

  const handleCalendarSync = (e) => {
    if (e.target.name === 'google') {
      if (e.target.checked) {
        setGoogle(true)
        setMicrosoft(false)
      } else {
        setGoogle(false)
      }
    } else {
      if (e.target.checked) {
        setGoogle(false)
        setMicrosoft(true)
      } else {
        setMicrosoft(false)
      }
    }
  }

  const fetchUserPreferences = async () => {
    try {
      const preferences = await getUserPreferences()
      if (preferences && preferences.length > 0) {
        setIsPreference(true)
        setUserPreferences(preferences[0])

        let startTime = timeToInt(preferences[0].preferred_start_time)
        let endTime = timeToInt(preferences[0].preferred_end_time)
        let breakTimestart
        let breakTimeEnd
        if (preferences[0].break_start_time && preferences[0].break_end_time) {
          breakTimestart = timeToInt(preferences[0].break_start_time)
          breakTimeEnd = timeToInt(preferences[0].break_end_time)
          setToggleBreakTimes(true)
        } else {
          breakTimestart = timeToInt('12:00:00')
          breakTimeEnd = timeToInt('13:00:00')
          setToggleBreakTimes(false)
        }

        setPreferredStartTime(startTime)
        setPreferredEndTime(endTime)
        setBreakStartTime(breakTimestart)
        setBreakEndTime(breakTimeEnd)
        setTimeZone(preferences[0].time_zone)
        if (preferences[0].additional_details && preferences[0].additional_details.length > 0) {
          setAdditionalDetails(preferences[0].additional_details)
          toggleAdditionalDetails(true)
        } else {
          toggleAdditionalDetails(false)
        }
        if (preferences[0]?.time_zone) {
          setMyTimezone(preferences[0].time_zone)
          setSelectedTimezone(preferences[0].time_zone)
        }
      } else {
        initializePreferedTime()
      }
    } catch (err) {
      initializePreferedTime()
      console.error(err?.message)
    }
  }

  const formatTime = (seconds) => {
    const date = new Date(0)
    date.setSeconds(seconds)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    values.timeZone = detectedTimezone
    setMyTimezone(detectedTimezone)
    setSelectedTimezone(detectedTimezone)
    fetchUserPreferences()
  }, [])

  useEffect(() => {
    if (userProfileDetail?.calendar_info) {
      if (userProfileDetail.calendar_info == 'google') {
        setGoogle(true)
        setMicrosoft(false)
      }
      if (userProfileDetail.calendar_info == 'microsoft') {
        setMicrosoft(true)
        setGoogle(false)
      }
    }
  }, [userProfileDetail])

  const handleFocus = () => {
    // Programmatically click on the input to trigger the time picker
    inputRef.current.click()
  }

  const handleToggleTimezoneScreen = () => {
    setIsTimezoneScreen(!isTimezoneScreen)

    setTimeout(() => {
      const divElement = document.getElementById('timezone-preference')
      divElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 100)

    // collapse = true;
  }

  const handleSelectTimezone = (timezone) => {
    setSelectedTimezone(timezone)
    // collapse = false;
  }

  const onCloseTimezoneScreen = () => {
    setIsTimezoneScreen(!isTimezoneScreen)
    setSelectedTimezone(myTimezone)
  }

  const handleTimezoneSubmit = () => {
    setMyTimezone(selectedTimezone)
    setIsTimezoneEmpty(false)
    setFilteredTimezones(timezones)
    handleToggleTimezoneScreen()
  }

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase()
    const filtered = timezones.filter((timezone) => timezone.toLowerCase().includes(query))
    setFilteredTimezones(filtered)
  }

  const handleFormSubmit = async () => {
    if (google) {
      calendarSync('google')
    } else if (microsoft) {
      calendarSync('microsoft')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    let checkTimesValues
    let checkTimeMessage = 'Preferred start time should be less than Preferred end time'
    if (toggleBreakTimes) {
      if (preferredStartTime > preferredEndTime) {
        checkTimesValues = false
        checkTimeMessage = 'Preferred start time should be less than Preferred end time'
      } else if (preferredStartTime > breakStartTime) {
        checkTimesValues = false
        checkTimeMessage = 'Preferred start time should be less than Break start time'
      } else if (preferredStartTime > breakEndTime) {
        checkTimesValues = false
        checkTimeMessage = 'Preferred start time should be less than Break end time'
      } else if (breakStartTime > breakEndTime) {
        checkTimesValues = false
        checkTimeMessage = 'Break start time should be less than Break end time'
      } else if (preferredEndTime < breakStartTime) {
        checkTimesValues = false
        checkTimeMessage = 'Preferred end time should be greater than Break start time'
      } else if (preferredEndTime < breakEndTime) {
        checkTimesValues = false
        checkTimeMessage = 'Preferred end time should be greater than Break end time'
      } else {
        checkTimesValues = true
      }
    } else {
      checkTimesValues = preferredStartTime < preferredEndTime
      if (!checkTimesValues) {
        checkTimeMessage = 'Preferred start time should be less than Preferred end time'
      }
    }

    if (checkTimesValues) {
      try {
        let startTime = timeFromInt(preferredStartTime, { format: 12 })
        let endTime = timeFromInt(preferredEndTime, { format: 12 })
        let breakTimestart = timeFromInt(breakStartTime, { format: 12 })
        let breakTimeEnd = timeFromInt(breakEndTime, { format: 12 })
        const payload = JSON.stringify({
          preferred_start_time: startTime,
          preferred_end_time: endTime,
          ...(toggleBreakTimes ? { break_start_time: breakTimestart, break_end_time: breakTimeEnd } : {}),
          time_zone: selectedTimezone,
          ...(toggleAdditionalDetails ? { additional_details: additionalDetails } : {}),
        })

        if (!isPreference) {
          const res = await fetch(API_ENDPOINTS.userPreferences, {
            method: 'POST',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            },
          })
          const data = await res.json()
          if (res.ok) {
            toast.success('Preferences saved successfully')
            handleFormSubmit()
            fetchUserPreferences()
          } else {
            throw new Error(data.message || 'Error saving preferences')
          }
        } else {
          const res = await fetch(API_ENDPOINTS.userPreferences + `/${userPreferences && userPreferences.id ? userPreferences.id : ''}`, {
            method: 'PUT',
            body: payload,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
            },
          })
          const data = await res.json()
          if (res.ok) {
            handleFormSubmit()
            toast.success('Preferences saved successfully')
            fetchUserPreferences()
          } else {
            throw new Error(data.message || 'Error saving preferences')
          }
        }
        if (activePage == 'CalendarSync') {
          navigateToPage('Home')
          setNewUser(false)
        }
      } catch (err) {
        console.error(err)
        toast.error(err?.message || 'Preferences not saved. Please try again.')
      }
    } else {
      toast.error(checkTimeMessage)
    }
  }
  const handleAdditionalDetailsChange = (e) => {
    const value = e.target.value
    if (value.length <= 230) {
      setAdditionalDetails(value)
    } else {
      setAdditionalDetails(value.slice(0, 230))
      toast.error('Character limit exceeded (Max: 230 characters)')
    }
  }
  return (
    <>
      {!isTimezoneScreen && (
        <div className="card border-radius-12 overflow-hidden outline user-preference-container">
          <div className="light-pink card-header-custom toggle-collapse" onClick={() => setToggleInfo(!toggleInfo)} aria-controls="user-preference-collapse" aria-expanded={toggleInfo}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 card-title">{heading ? heading : 'SKOOP Booking Link Setup'}</h6>
              {!collapse && (
                <div>
                  <FaAngleDown style={toggleInfo ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }} />
                </div>
              )}
            </div>
          </div>
          <Collapse in={toggleInfo}>
            <div id="user-preference-collapse">
              <form onSubmit={handleSubmit}>
                <div className="card-body p-0">
                  <div className="container my-2">
                    <div className="mb-3">
                      <label className="form-label profile-text">Preferred Start Time</label>
                      <div className="position-relative mt-2">
                        <TimePicker value={preferredStartTime} onChange={(time) => setPreferredStartTime(time)} className="custom-time-picker" />
                        <div className="clock-icon">
                          <FaRegClock size={14} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label profile-text">Preferred End Time</label>
                      <div className="position-relative mt-2">
                        <TimePicker value={preferredEndTime} onChange={(time) => setPreferredEndTime(time)} className="custom-time-picker" />
                        <div className="clock-icon">
                          <FaRegClock size={14} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label profile-text">Time Zone</label>
                      <div className="position-relative mt-2" onClick={handleToggleTimezoneScreen}>
                        <input className="form-control cursor-pointer custom-input-global" id="time-zone-dropdown" type="text" name="timezone" placeholder="Select time zone" value={myTimezone} readOnly />
                        <button className="btn position-absolute end-0 top-50 translate-middle-y border-0" type="button">
                          <MdExpandMore size={16} />
                        </button>
                      </div>
                      {isTimezoneEmpty && <ValidationError title="Please select timezone" />}
                    </div>
                    <div className={`${toggleBreakTimes ? 'mb-3' : 'mb-2'}`}>
                      <div className="d-flex justify-content-between align-items-center mt-1-3">
                        <label className="form-label profile-text fw-bold">Add Break Times</label>
                        <div class="form-check form-switch switch-button-container d-flex justify-content-end me-2 align-items-center">
                          <input className="form-check-input custom-switch" name="toggle-break-times" type="checkbox" role="switch" checked={toggleBreakTimes} onChange={handleSwitchChange} />
                        </div>
                      </div>
                      {toggleBreakTimes && (
                        <>
                          <label className="form-label profile-text">Break Start Time</label>
                          <div className="position-relative mt-2">
                            <TimePicker value={breakStartTime} onChange={(time) => setBreakStartTime(time)} className="custom-time-picker" />
                            <div className="clock-icon">
                              <FaRegClock size={14} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {toggleBreakTimes && (
                      <div className="mb-3">
                        <label className="form-label profile-text">Break End Time</label>
                        <div className="position-relative mt-2">
                          <TimePicker value={breakEndTime} onChange={(time) => setBreakEndTime(time)} className="custom-time-picker" />
                          <div className="clock-icon">
                            <FaRegClock size={14} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={`${toggleAdditionalDetails ? 'mb-3' : 'mb-2'}`}>
                      <div className="d-flex justify-content-between align-items-center mt-1-3">
                        <label className="form-label profile-text fw-bold">Add Booking Link Details</label>
                        <div class="form-check form-switch switch-button-container d-flex justify-content-end me-2 align-items-center">
                          <input className="form-check-input custom-switch" name="toggle-additional-details" type="checkbox" role="switch" checked={toggleAdditionalDetails} onChange={handleSwitchChange} />
                        </div>
                      </div>
                      {toggleAdditionalDetails && (
                        <>
                          <label className="form-label profile-text">Booking Link Details</label>
                          <textarea
                            className="form-control mt-2 custom-textarea-global"
                            id="booking-link-details"
                            name="bookingLinkDetails"
                            placeholder="Booking Link Details"
                            value={additionalDetails}
                            onChange={handleAdditionalDetailsChange}
                            rows="3"
                          ></textarea>
                        </>
                      )}
                    </div>
                    <div className="mb-3">
                      <p className="card-title">You can add update these from the account settings anytime.</p>
                      <p className="card-title">Connect your calendar to auto-check for busy times and add new events as they are scheduled.</p>

                      <div class="d-flex flex-column align-items-center justify-content-start mt-3">
                        <div class="d-flex align-items-center w-100 justify-content-between">
                          <div class="d-flex align-items-center">
                            <input class="form-check-input mt-0 pt-0 ml-0-4" type="checkbox" value="" name="google" checked={google} onChange={handleCalendarSync} id="google"></input>
                            <label class="d-flex align-items-center ms-2" for="google">
                              <FcGoogle />
                              <h5 class="card-title mb-0 pb-0 ms-1">Google Calendar</h5>
                            </label>
                          </div>
                          {userProfileDetail?.calendar_info && (
                            <div className="d-flex justify-content-end align-items-center">
                              <span className="badge badge-pill badge-primary">Synced</span>
                            </div>
                          )}
                        </div>
                        <div class="d-flex align-items-center w-100 mt-3">
                          <div class="d-flex align-items-center">
                            <input class="form-check-input mt-0 pt-0 ml-0-4" type="checkbox" value="" name="microsoft" checked={microsoft} onChange={handleCalendarSync} id="microsoft"></input>
                            <label class="d-flex align-items-center ms-2" for="microsoft">
                              <FaMicrosoft />
                            </label>
                            <h5 class="card-title mb-0 pb-0 ms-1">Outlook Calendar</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 d-flex justify-content-end">
                      {showSkip && (
                        <button
                          onClick={() => {
                            navigateToPage('Home')
                            setNewUser(false)
                          }}
                          className="mx-2 card-btn btn-text"
                        >
                          Skip
                        </button>
                      )}
                      <button type="submit" className="mx-2 card-btn btn-text">
                        {!isPreference ? 'Save' : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      )}
      {isTimezoneScreen && (
        <div id="timezone-preference" className=" py-3 px-2 time-zone-main user-preference-timezone">
          <div className="pt-3 timezone-head d-flex justify-content-between">
            <h2>Select time zone</h2>
            <RxCross2 className="cursor-pointer" size={20} color="#2C2D2E" onClick={onCloseTimezoneScreen} />
          </div>
          <div className="position-relative custom-password-input-box">
            <input type="text" className="form-control mt-3" id="timezone-search-input-box" placeholder="Search" onChange={handleSearch} />
            <button className="btn position-absolute ps-3 top-50 translate-middle-y border-0" type="button">
              <IoSearchOutline />
            </button>
          </div>

          <div className="mt-4" id="timezone-list-container">
            {filteredTimezones.map((timezone, index) => (
              <div>
                <div onClick={() => handleSelectTimezone(timezone)} className={`px-2 timezone-item cursor-pointer`} id={`${selectedTimezone === timezone ? 'selected-timezone' : ''}`} key={index}>
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
    </>
  )
}

export default UserPreferencesForm
