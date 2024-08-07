import React, { useEffect, useState, useMemo } from 'react'
import { FaPlay, FaStop, FaPause } from 'react-icons/fa'
import { MdOutlineRestartAlt } from 'react-icons/md'
import { useRecording } from '../contexts/RecordingContext'
import { sendMessageToBackgroundScript, sendMessageToContentScript } from '../lib/sendMessageToBackground'
import { useTimer } from '../contexts/TimerContext'
import TimerDisplay from '../components/TimerDisplay'

export const CameraScreen = () => {
  const { setIsRecordStart, height, width, videoStream, setVideoStream, stopMediaStreams, captureCameraWithScreen } = useRecording()
  const { stopTimer, resetTimer, restartTimer, startCountdown, isPaused, resumeTimer, pauseTimer } = useTimer()
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    // This effect runs only when `videoStream` changes.
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoStream])

  useEffect(() => {
    // Function to get the selected media stream
    const getMediaStream = async () => {
      try {
        // Get saved device labels from Chrome storage
        
        setTimeout(()=>{setIsDisabled(false)},3500)
        chrome.storage.sync.get(['selectedVideoLabel'], async (result) => {
          const savedVideoLabel = result.selectedVideoLabel

          // Enumerate devices to find the saved video device
          const devices = await navigator.mediaDevices.enumerateDevices()

          let videoDevice
          if (savedVideoLabel) {
            videoDevice = devices.find((device) => device.label === savedVideoLabel)
          }

          if (!videoDevice) {
            // If no saved label or the device is not found, select the first video input device
            videoDevice = devices.find((device) => device.kind === 'videoinput')
          }

          if (videoDevice) {
            const videoConstraints = {
              deviceId: { exact: videoDevice.deviceId },
              width: { ideal: width },
              height: { ideal: height },
            }
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints })

            setVideoStream(videoStream)
          } else {
            console.error('No video input device found.')
          }
        })
      } catch (err) {
        console.error(err)
      }
    }
    if (captureCameraWithScreen) {
      getMediaStream()
    }
    let skoopExtensionBody = document.getElementById('skoop-extension-body')
    if (skoopExtensionBody) {
      skoopExtensionBody.style.minWidth = '0'
    }

    return () => {
      stopMediaStreams()
    }
  }, [width, height, captureCameraWithScreen])

  const toggleStop = () => {
    const message = {
      action: 'stopRecording',
    }
    sendMessageToContentScript({action:"moveToPosition"})
    chrome.storage.sync.remove('recordingType', function() {
      console.log('recordingType has been removed from Chrome storage');
    })
    stopMediaStreams()
    sendMessageToBackgroundScript(message)
    setIsRecordStart(false)
    stopTimer()
  }
  const pauseRecording = () => {
    const message = {
      action: 'togglePauseResumeRecording',
    }
    sendMessageToBackgroundScript(message)

    stopTimer()
    // Check if the recording is currently paused and toggle the timer state accordingly
    if (isPaused) {
      resumeTimer()
      setIsRecordStart(true)
    } else {
      pauseTimer()
      setIsRecordStart(false)
    }
  }
  const toggleRestart = () => {
    const message = {
      action: 'restartRecording',
    }
    sendMessageToBackgroundScript(message)
    sendMessageToContentScript({ action: 'showScreenRecordingTimer' })
    startCountdown(3)
    setTimeout(() => {
      restartTimer()
    }, 3000)
  }

  const videoElement = useMemo(
    () => (
      <video
        autoPlay
        muted
        playsInline
        ref={(el) => {
          if (el) el.srcObject = videoStream
        }}
      />
    ),
    [videoStream]
  )

  return (
    <>
      <div className="video-container">
        {captureCameraWithScreen && videoElement}
        {captureCameraWithScreen && <TimerDisplay />}

        <div className={`recording-action-container ${captureCameraWithScreen ? 'position-absolute' : ''}`}>
          <button className="camera-record-btn" onClick={toggleRestart} disabled={isDisabled}>
            <MdOutlineRestartAlt className="icon" />
          </button>
          <button className="camera-record-btn camera-rec-stop-btn" disabled={isDisabled}  onClick={toggleStop}>
            <FaStop className="icon" />
          </button>
          <button className="camera-record-btn rec-pause-btn" disabled={isDisabled} onClick={pauseRecording}>
            {isPaused ? <FaPlay className="icon" /> : <FaPause className="icon" />}
          </button>
          {!captureCameraWithScreen && <TimerDisplay />}
        </div>
      </div>
    </>
  )
}

export default CameraScreen
