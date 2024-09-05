import React, { useEffect, useRef, useContext, useMemo, useState } from 'react'
import { FaPlay, FaStop, FaPause } from 'react-icons/fa'
import { MdOutlineRestartAlt } from 'react-icons/md'
import { useRecording } from '../contexts/RecordingContext'
import { useTimer } from '../contexts/TimerContext'
import TimerDisplay from '../components/TimerDisplay'
import ScreenContext from '../contexts/ScreenContext'
import GlobalStatesContext from '../contexts/GlobalStates'
import { sendMessageToContentScript } from '../lib/sendMessageToBackground'
import { useUserSettings } from '../contexts/UserSettingsContext'
import TourContext from '../contexts/TourContext.js'

export const VideoRecording = () => {
  const { setIsRecording, setIsRecordStart, height, width, videoStream, setVideoStream, stopMediaStreams, handleVideoBlob ,captureCameraWithScreen,isRecording} = useRecording()
  const { stopTimer, startCountdown, isPaused, resumeTimer, pauseTimer, startMainTimer ,seconds} = useTimer()
  const mediaRecorderRef = useRef(null)
  const { expandExtension } = useContext(GlobalStatesContext)
  const { navigateToPage } = useContext(ScreenContext)
  const recordedChunksRef = useRef([])
  const isRestartingRef = useRef(false)
  const [countdown, setCountdown] = useState(null)
  const {fetchMySettings}=useUserSettings();
  const { componentsVisible, isVideoTour, activeTourStepIndex, renderNext, setStepIndex, initializeTour, startTour } = useContext(TourContext);
  const videoContainerRef = useRef(null);
  const [isCountdownInitiated, setIsCountdownInitiated] = useState(false);
  useEffect(()=>{console.log(captureCameraWithScreen,seconds,isRecording)
    if(seconds>=120 && isRecording){
      toggleStop();
      fetchMySettings()
  }})
  
  useEffect(() => {
    if (countdown !== null) {
      const timer = countdown > 0 ? setTimeout(() => setCountdown(countdown - 1), 1000) : null

       if(countdown==2 && !isCountdownInitiated){
        initializeTour();
        startTour("videos");
        setIsCountdownInitiated(true);
        setTimeout(() => {
          setStepIndex(12); 
        }, 0);
       }

      // When countdown finishes, start recording
      if (countdown === 0) {
        startMainTimer()
        setTimeout(() => setCountdown(null), 1000) // Hide countdown after 1 second
      }

      return () => clearTimeout(timer)
    }
  }, [countdown])
  const initiateCountdown = () => {
    setCountdown(3)
  }
  
  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const result = await chrome.storage.sync.get(['selectedVideoLabel', 'selectedAudioLabel'])
        const savedVideoLabel = result.selectedVideoLabel
        const savedAudioLabel = result.selectedAudioLabel
        const devices = await navigator.mediaDevices.enumerateDevices()

        const videoDevices = devices.filter((device) => device.kind === 'videoinput')
        const audioDevices = devices.filter((device) => device.kind === 'audioinput')

        let videoDevice = savedVideoLabel ? videoDevices.find((device) => device.label === savedVideoLabel) : videoDevices[0] // Default to first video device

        let audioDevice = savedAudioLabel ? audioDevices.find((device) => device.label === savedAudioLabel) : audioDevices[0] // Default to first audio device

        const videoConstraints = videoDevice ? { deviceId: { exact: videoDevice.deviceId }, width: { ideal: width }, height: { ideal: height } } : { width: { ideal: width }, height: { ideal: height } }

        const audioConstraints = audioDevice ? { deviceId: { exact: audioDevice.deviceId } } : true // Use the default audio device

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioConstraints,
        })
        setVideoStream(stream), (mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' }))
        initiateCountdown()
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
          }
        }

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)
          recordedChunksRef.current = []
          setIsRecording(false)

          if (!isRestartingRef.current) {
            if (stream) {
              stream.getTracks().forEach((track) => track.stop())
            }
            handleVideoBlob({ videoBlob: blob, url })
            fetchMySettings();
            URL.revokeObjectURL(url)
            navigateToPage('Home')
          }
        }

        setIsRecording(true)
        let skoopExtensionBody = document.getElementById('skoop-extension-body')
        if (skoopExtensionBody) {
          skoopExtensionBody.style.minWidth = '0'
        }

        const message = { action: 'resizeIframe', width, height, hideResizer: true }

        chrome.runtime.sendMessage(message, function (response) {
          // console.log(response)
        })

        chrome.runtime.sendMessage({ action: 'hideResizer' }, function (response) {
          // console.log(response)
        })
        setTimeout(() => {
          mediaRecorderRef.current.start()
          startMainTimer()
        }, 3000)
      } catch (err) {
        console.error(err)
      }
    }

    getMediaStream()

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      stopMediaStreams()
      const message = { action: 'resizeIframe', reset: true, showResizer: true }
      chrome.runtime.sendMessage(message, function (response) {
        // console.log(response)
      })
      expandExtension()
    }
  }, [width, height])

  const toggleStop = () => {

    sendMessageToContentScript({action:"moveToPosition"})
    chrome.storage.sync.remove('recordingType', function() {
      console.log('recordingType has been removed from Chrome storage');
    })

    if(isVideoTour && activeTourStepIndex === 12) {
      renderNext();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      stopMediaStreams()
      setIsRecording(false)
      setIsRecordStart(false)
      stopTimer()
      navigateToPage('Home')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      pauseTimer()
      setIsRecording(false)
    } else if (mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      resumeTimer()
      setIsRecording(true)
    }
  }

  const toggleRestart = () => {
    isRestartingRef.current = true
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    recordedChunksRef.current = []
    initiateCountdown()
    setTimeout(() => {
      startCountdown(3)
      setTimeout(() => {
        mediaRecorderRef.current.start()
        startMainTimer()
        isRestartingRef.current = false
      }, 3000)
    }, 0)
  }

  useEffect(() => {
    if (isVideoTour) {
      if (componentsVisible?.renderItem === 13) {
        toggleStop();
      }
    }
  }, [componentsVisible])

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
    <div className="video-container" ref={videoContainerRef}>
      {videoElement}
      {countdown !== null && countdown > 0 && (
        <div className="countdown-overlay-container">
          <div className="countdown-number">{countdown}</div>
        </div>
      )}
      <TimerDisplay />
      <div className="recording-action-container position-absolute">
        <button id="video-restart-btn" className="camera-record-btn rec-restart-btn" onClick={toggleRestart}>
          <MdOutlineRestartAlt className="icon" />
        </button>
        <button id="video-stop-btn" className="camera-record-btn camera-rec-stop-btn" onClick={toggleStop}>
          <FaStop className="icon" />
        </button>
        <button id="video-pause-btn" className="camera-record-btn rec-pause-btn" onClick={pauseRecording}>
          {isPaused ? <FaPlay className="icon" /> : <FaPause className="icon" />}
        </button>
      </div>
    </div>
  )
}

export default VideoRecording
