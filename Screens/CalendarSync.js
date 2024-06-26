import React, { useContext, useEffect, useState } from 'react'
import ScreenContext from '../contexts/ScreenContext'
import AuthContext from '../contexts/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { FaMicrosoft } from 'react-icons/fa'
import UserPreferencesForm from '../components/UserPreferencesForm'

const CalendarSync = () => {
  const { calendarSync, setNewUser } = useContext(AuthContext)
  const { navigateToPage } = useContext(ScreenContext)

  const [google, setGoogle] = useState(false)
  const [microsoft, setMicrosoft] = useState(false)

  return (
    <>
      <div class="container">
        <h2 class="my-4">Skoop Appointment Setup</h2>
        <UserPreferencesForm heading="Please add your appointments scheduling preferences for skoop Calendar" collapse={true} showSkip={true} />
        {/* <div
          onClick={() => {navigateToPage("Home");setNewUser(false)}}
          class="btn btn-link mt-4 card-title"
        >
          Continue without Skoop Appointment booking System
          <p>You can add your calendar link for from account setting.</p>
        </div> */}
      </div>
    </>
  )
}

export default CalendarSync
