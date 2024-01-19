import React, { useState, useEffect, useContext, useRef} from 'react';
import { AiFillAudio } from 'react-icons/ai';
import { UserInput } from '../UserInput/index.js';
import { MdFileUpload } from 'react-icons/md';
import { IoMdDownload } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { FaStop } from 'react-icons/fa';

import API_ENDPOINTS from '../apiConfig.js';
import { getCurrentDateTimeString, replaceInvalidCharacters } from '../../utils/index.js';
import { PiExportFill } from 'react-icons/pi';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import toast from 'react-hot-toast';
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js';
import { AiOutlineClose } from 'react-icons/ai';
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
            setCapturing(false)
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

    setCapturing(true)
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
          <button
            onClick={isRecording ? stopRecordingAndCloseModal : startRecording}
            id="skoop_record_button_audio"
            data-mdb-toggle="tooltip"
            data-mdb-placement="bottom"
            title="Record Audio"
            style={{ zIndex: 2 }}
          >
            {isRecording ? (
              <FaStop size={30} color="white" />
            ) : (
              <AiFillAudio size={30} color="white" />
            )}
          </button>
          <div>
            <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
              <div className="modal-dialog modal-sm modal-dialog-centered">
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
