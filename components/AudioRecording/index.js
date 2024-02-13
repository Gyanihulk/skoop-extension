import React, { useState, useEffect, useContext, useRef} from 'react';
import { AiFillAudio } from 'react-icons/ai';
import { UserInput } from '../UserInput/index.js';
import { FaStop } from 'react-icons/fa';

import API_ENDPOINTS from '../apiConfig.js';
import { getCurrentDateTimeString, replaceInvalidCharacters } from '../../utils/index.js';

import GlobalStatesContext from '../../contexts/GlobalStates.js';
import toast from 'react-hot-toast';
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js';
import { continuousVisualizer } from 'sound-visualizer';

const VoiceVisualization = ({setIconsVisible,setBlobUrl,setIsUploading,setCapturing,addToMessage,setVideoPlayerId,setVideoId}) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [visualizationUrl, setVisualizationUrl] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isTakingInput, setIsTakingInput] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const continuousCanvasRef = useRef(null);


    const { globalRefresh, setGlobalRefresh, isLinkedin, selectedChatWindows } =
        useContext(GlobalStatesContext);
    const { getThumbnail } = useContext(MediaUtilsContext);

    useEffect(() => {
        let intervalId;
        if (isRecording) {
            setShowModal(true);
            intervalId = setInterval(() => setTime(time + 1), 1000);
            if (time == 60) {
                stopRecording();
            }
        }
        return () => clearInterval(intervalId);
    }, [isRecording, time]);

    useEffect(() => {
        if (visualizationUrl != '') {
            handleShare(getCurrentDateTimeString(), 'Media');
        }
    }, [visualizationUrl]);

    useEffect(() => {
        if (isRecording && continuousCanvasRef.current) {
          const { start, stop, reset } = continuousVisualizer(mediaRecorder.stream, continuousCanvasRef.current, {});
          start();
    
          const stopContinuous = () => {
            stop();
          };
    
          return () => {
            stopContinuous();
          };
        }
      }, [isRecording, mediaRecorder]);


    const handleShare = async (audioTitle, directoryName) => {
        try {
            setIsUploading(true)
            var title1 = audioTitle;
            audioTitle = replaceInvalidCharacters(audioTitle + `_${Date.now()}`);
            const blobres = await fetch(visualizationUrl);
            const blob = await blobres.blob();
            const audioUrl = URL.createObjectURL(blob);
            setBlobUrl(audioUrl)

            const formData = new FormData();
            let file = new File([blob], 'recording');
            formData.append('data', file, `${audioTitle}.wav`);
            const customHeaders = new Headers();
            customHeaders.append('title', audioTitle);
            customHeaders.append('directory_name', directoryName);
            customHeaders.append('duration', duration);
            customHeaders.append('type', 'wav');
            customHeaders.append(
                'authorization',
                `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            );
            customHeaders.append('title1', title1);
       
            const loadingObj = toast.loading('uploading Voice Memo...');
            var response = await fetch(API_ENDPOINTS.vidyardUpload, {
                method: 'POST',
                headers: customHeaders,
                body: formData,
            });
            response = await response.json();
            toast.success('Voice Memo uploaded,encoding in progress', {
                id: loadingObj,
            })
            setIsUploading(false)
        
            setVideoPlayerId(response.facade_player_uuid);
            setVideoId(response.id);
            addToMessage(response.facade_player_uuid);
            setGlobalRefresh(true);
            setIconsVisible(true)
        } catch (err) {
            toast.dismiss();
            toast.error('could not upload');
        }
    };

    const startRecording = async () => {
        try {
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            const chunks = [];
            const recorder = new MediaRecorder(micStream);
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            recorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setVisualizationUrl(audioUrl);
            };
            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            toast.error('please provide the permission to access your microphone');
            return;
        }
    };

    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
        setShowModal(false);
        setDuration(time);
        setTime(0);
    };

    const downloadAudio = () => {
        const a = document.createElement('a');
        a.href = visualizationUrl;
        a.download = 'voice_visualization.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const sharingDetails = (audioTitle, directoryName) => {
        setIsTakingInput(false);
        handleShare(audioTitle, directoryName);
    };

    if (isTakingInput) {
        return (
            <UserInput
                sharingDetails={sharingDetails}
                cancelUpload={() => {
                    setIsTakingInput(false);
                }}
            />
        );
    }

    const closeModal = () => {
        setShowModal(false);
        stopRecording();

      };

      const stopRecordingAndCloseModal = () => {
        stopRecording();
        setShowModal(false);
      };
   
      return (
        <div id="homeDiv" className='text-center'>
          <div className='d-flex flex-column'>

          
          <button
            onClick={isRecording ? stopRecordingAndCloseModal : startRecording}
            id="skoop_record_button"
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Record Audio"
          >
            {isRecording ? (
              // <FaStop size={30} color="white" />
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.8418 36C33.1618 36 35.8418 33.32 35.8418 30V18C35.8418 14.68 33.1618 12 29.8418 12C26.5218 12 23.8418 14.68 23.8418 18V30C23.8418 33.32 26.5218 36 29.8418 36ZM41.6618 30C40.6818 30 39.8618 30.72 39.7018 31.7C38.8818 36.4 34.7818 40 29.8418 40C24.9018 40 20.8018 36.4 19.9818 31.7C19.8218 30.72 19.0018 30 18.0218 30C16.8018 30 15.8418 31.08 16.0218 32.28C17.0018 38.28 21.8018 42.98 27.8418 43.84V48C27.8418 49.1 28.7418 50 29.8418 50C30.9418 50 31.8418 49.1 31.8418 48V43.84C37.8818 42.98 42.6818 38.28 43.6618 32.28C43.8618 31.08 42.8818 30 41.6618 30Z" fill="white"/>
</svg>

            ) : (
              // <AiFillAudio size={30} color="white" />
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.8418 36C33.1618 36 35.8418 33.32 35.8418 30V18C35.8418 14.68 33.1618 12 29.8418 12C26.5218 12 23.8418 14.68 23.8418 18V30C23.8418 33.32 26.5218 36 29.8418 36ZM41.6618 30C40.6818 30 39.8618 30.72 39.7018 31.7C38.8818 36.4 34.7818 40 29.8418 40C24.9018 40 20.8018 36.4 19.9818 31.7C19.8218 30.72 19.0018 30 18.0218 30C16.8018 30 15.8418 31.08 16.0218 32.28C17.0018 38.28 21.8018 42.98 27.8418 43.84V48C27.8418 49.1 28.7418 50 29.8418 50C30.9418 50 31.8418 49.1 31.8418 48V43.84C37.8818 42.98 42.6818 38.28 43.6618 32.28C43.8618 31.08 42.8818 30 41.6618 30Z" fill="white"/>
</svg>

            )}
          </button>
          <span className='record-button-bottom-text'> Record audio</span>
          </div>
          <div>
            <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
              <div className=" modal-sm modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body"style={{ maxHeight: '150px'}}>
                    {isRecording && <canvas id="continuous" ref={continuousCanvasRef}></canvas>}
                  </div>
                  <div className="modal-footer d-flex justify-content-between">
                        <div>{isRecording && <h6>Time Remaining: {60 - time} Sec</h6>}</div>
                        <button type="button" className="btn btn-danger btn-sm" onClick={stopRecordingAndCloseModal}>
                        Stop Recording
                        </button>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
      );
    };
    
    export default VoiceVisualization;
