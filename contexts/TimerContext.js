import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const TimerContext = createContext()

export const useTimer = () => useContext(TimerContext)

export const TimerProvider = ({ children }) => {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  // Converts formatted time "mm:ss" to total seconds
  const timeToSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }

  // Listens for messages from the background script
  useEffect(() => {
    const handleMessage = (message, sender) => {
      if (message.action === 'updateTimer') {
        const newSeconds = timeToSeconds(message.time)
        setSeconds(newSeconds)

        // Assuming the message contains a property 'isPaused'
        if (message.isPaused !== undefined) {
          setIsPaused(message.isPaused)

          // If the message indicates the timer is paused, ensure we clear any running timers
          if (message.isPaused && timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
        }

        // Optionally handle 'isActive' if needed, assuming 'isActive' is part of the message
        if (message.isActive !== undefined) {
          setIsActive(message.isActive)
        }
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, []) // Dependencies array is empty to ensure this effect runs only once when the component mounts.

  // Function to start the main timer without a countdown
  const startMainTimer = () => {
    setIsActive(true)
    setIsPaused(false)
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1)
      }, 1000)
    }
  }

  // Function to start a countdown
  const startCountdown = (duration = 3) => {
    setCountdown(duration)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1
        } else {
          clearInterval(countdownRef.current)
          countdownRef.current = null
          startMainTimer() // Automatically start main timer after countdown
          setCountdown(null)
          setSeconds(0)
          return null
        }
      })
    }, 1000)
  }

  const stopTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCountdown(null)
    setSeconds(0)
  }

  const resetTimer = () => {
    stopTimer()
    setSeconds(0)
  }

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsPaused(true)
    }
  }

  const resumeTimer = () => {
    if (!timerRef.current && isPaused) {
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1)
      }, 1000)
    }
  }

  return (
    <TimerContext.Provider
      value={{
        seconds,
        countdown,
        isActive,
        isPaused,
        startMainTimer,
        startCountdown,
        stopTimer,
        resetTimer,
        pauseTimer,
        resumeTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}
