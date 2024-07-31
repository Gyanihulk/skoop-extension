import React, { useEffect } from 'react'
import { useTimer } from '../contexts/TimerContext'
import { useRecording } from '../contexts/RecordingContext'

const TimerDisplay = () => {
  const { seconds, countdown } = useTimer()

  const { captureCameraWithScreen } = useRecording()

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (seconds == 0) {
    return
  }
  return <div className={`timer ${captureCameraWithScreen ? 'position-absolute top-0 end-0 mt-2 me-2' : ''}`}>{countdown !== null ? countdown : formatTime(seconds)}</div>
}

export default TimerDisplay
