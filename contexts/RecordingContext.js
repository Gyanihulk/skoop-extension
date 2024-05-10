import React, { createContext, useContext, useEffect, useRef, useState } from "react";

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
        videoResizeConstant
      };
  return (
    <RecordingContext.Provider value={contextValue}>
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingContext;
