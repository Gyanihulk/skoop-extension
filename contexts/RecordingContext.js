import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { replaceInvalidCharacters } from "../utils";
import GlobalStatesContext from "./GlobalStates";
import API_ENDPOINTS from "../components/apiConfig";
import MessageContext from "./MessageContext";

const RecordingContext = createContext();
export const useRecording = () => {
    const context = useContext(RecordingContext);
    if (!context) {
      throw new Error('useRecording must be used within a RecordingProvider');
    }
    return context;
  };

export const RecordingProvider = ({ children }) => {
    const videoResizeConstant = 32
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [visualizationUrl, setVisualizationUrl] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isTakingInput, setIsTakingInput] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const continuousCanvasRef = useRef(null);

    const [capturing, setCapturing] = useState(false)
    const [prev, setPrev] = useState('')
    const [countdown, setCountdown] = useState(false)
    const [countTimer, setCountTimer] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
  
    const [bloburl, setBlobUrl] = useState(null)
    const [height, setHeight] = useState(16 * videoResizeConstant)
    const [width, setWidth] = useState(9 * videoResizeConstant)
    const [videoSettingsOpen, setVideoSettingsOpen] = useState(false)
    const [selectedVideoStyle, setSelectedVideoStyle] = useState('Vertical Mode')
    const [isRecordStart, setIsRecordStart] = useState(false)
    const [isVideo, setIsVideo] = useState(false)
    const { setGlobalRefresh, setLatestVideo, setLatestBlob } =
    useContext(GlobalStatesContext)
    const { addToMessage } = useContext(MessageContext)
    const stopAudioRecording = () => {
      mediaRecorder.stop()
      setIsRecordStart(false)
      setIsRecording(false)
      setShowModal(false)
      setDuration(time)
      setTime(0)
    }
    const startRecordingAudio = async () => {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        })
        const chunks = []
        const recorder = new MediaRecorder(micStream)
        recorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' })
          const audioUrl = URL.createObjectURL(audioBlob)
          setVisualizationUrl(audioUrl)
        }
        recorder.start()
        setMediaRecorder(recorder)
        setIsRecording(true)
        setIsRecordStart(true)
      } catch (error) {
        toast.error('please provide the permission to access your microphone')
        return
      }
    }
    const restartRecordingAudio = async () => {
      try {
        // If a recording is already in progress, stop it
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    
        // Start a new recording session
        await startRecordingAudio();
      } catch (error) {
        toast.error('An error occurred while restarting the recording');
        console.error(error);
      }
    }
    
  const handleShareAudio = async (audioTitle, directoryName) => {
    try {
      setIsUploading(true)
      var title1 = audioTitle
      audioTitle = replaceInvalidCharacters(audioTitle + `_${Date.now()}`)
      const blobres = await fetch(visualizationUrl)
      const blob = await blobres.blob()
      setLatestBlob(blob)

      const formData = new FormData()
      let file = new File([blob], 'recording')
      formData.append('data', file, `${audioTitle}.wav`)
      const customHeaders = new Headers()
      formData.append('height', 500)
      formData.append('width', 500)
      customHeaders.append('title', audioTitle)
      customHeaders.append('directory_name', directoryName)
      customHeaders.append('duration', duration)
      customHeaders.append('type', 'wav')
      customHeaders.append(
        'authorization',
        `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
      )
      customHeaders.append('title1', title1)

      const loadingObj = toast.loading('Uploading Voice Memo...')
      var response = await fetch(API_ENDPOINTS.vidyardUploadAudio, {
        method: 'POST',
        headers: customHeaders,
        body: formData,
      })
      response = await response.json()
      console.log(response)
      toast.success('Voice Memo uploaded,encoding in progress', {
        id: loadingObj,
      })
      setIsUploading(false)
      addToMessage(response.facade_player_uuid)
      setGlobalRefresh(true)
      setLatestVideo(response)
    } catch (err) {
      console.log(err,"hello")
      toast.dismiss()
      toast.error('Could not upload.')
    }
  }

    const contextValue = {
        mediaRecorder,
        setMediaRecorder,
        visualizationUrl,
        setVisualizationUrl,
        isRecording,
        setIsRecording,
        isTakingInput,
        setIsTakingInput,
        time,
        setTime,
        duration,
        setDuration,
        showModal,
        setShowModal,
        continuousCanvasRef,
        capturing,
        setCapturing,
        prev,
        setPrev,
        countdown,
        setCountdown,
        countTimer,
        setCountTimer,
        isUploading,
        setIsUploading,
        bloburl,
        setBlobUrl,
        height,
        setHeight,
        width,
        setWidth,
        videoSettingsOpen,
        setVideoSettingsOpen,
        selectedVideoStyle,
        setSelectedVideoStyle,
        isRecordStart,
        setIsRecordStart,
        isVideo,
        setIsVideo,
        videoResizeConstant,
        stopAudioRecording,
        startRecordingAudio,
        restartRecordingAudio,
        handleShareAudio
      };
  return (
    <RecordingContext.Provider value={contextValue}>
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingContext;
