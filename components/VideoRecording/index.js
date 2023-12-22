import React, { useState, useEffect, useContext, useRef } from 'react';
import Webcam from 'react-webcam';
import API_ENDPOINTS from '../apiConfig.js';
import { FaDownload } from 'react-icons/fa6';
import { FaTimesCircle } from 'react-icons/fa';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { MdDeleteForever, MdOutlineVideoSettings, MdOutlineSendTimeExtension } from 'react-icons/md';
import { AiOutlineClose } from "react-icons/ai";



import {
    getCurrentDateTimeString,
    insertHtmlAtPositionInMail,
    insertIntoLinkedInMessageWindow,
    replaceInvalidCharacters,
} from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import toast, { Toaster } from 'react-hot-toast';

import ChatWindowSelection from '../ChatWindowSelection/index.js';
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js';
const videoResizeConstant = 25;
const RecordingButton = ({ aspectR, setUrlAtHome }) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [prev, setPrev] = useState('');
    const [time, setTime] = useState(0);
    const [videoPlayerId, setVideoPlayerId] = useState('');
    const [videoId,setVideoId] = useState('')
    const [countdown, setCountdown] = useState(false);
    const [countTimer, setCountTimer] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [initialX, setInitialX] = useState((-1 * 200) / 4);
    const [initialY, setInitialY] = useState((-1 * 200) / 8);
    const [currentX, setCurrentX] = useState((-1 * 200) / 4);
    const [currentY, setCurrentY] = useState((-1 * 200) / 8);
    const [init, setInit] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bloburl, setBlobUrl] = useState(null);
    const { setGlobalRefresh, isLinkedin, selectedChatWindows } = useContext(GlobalStatesContext);
    const { getThumbnail } = useContext(MediaUtilsContext);
    const [aspectRatio, setAspectRatio] = useState([9, 16]);
    const [videoSettingsOpen, setVideoSettingsOpen] = useState(false);
    const [selectedVideoStyle, setSelectedVideoStyle] = useState(null);
    const [iconsVisible, setIconsVisible] = useState(true);

    const handleVideoStyleSelect = (style) => {
        setSelectedVideoStyle(style);

        if (style === 'Square') {
            setAspectRatio([10, 10]);
        } else if (style === 'Vertical Mode') {
            setAspectRatio([9, 16]);
        } else {
            setAspectRatio([16, 9]);
        }
        toggleVideoSettings();
        console.log(`Selected Video Style: ${style}`);
    };
    const toggleVideoSettings = () => {
        setVideoSettingsOpen(!videoSettingsOpen);
    };

    const handleInsertion = async() => {
        console.log(isLinkedin, 'test linkedin ');
        if (isLinkedin) {
            insertIntoLinkedInMessageWindow(
                `<p>https://share.vidyard.com/watch/${videoPlayerId}</p>`,
                selectedChatWindows
            );
        } else {
            const thumbnail_link=await getThumbnail(videoId);
            var ret=''
            if(thumbnail_link!=undefined && thumbnail_link!=null){
                ret=`<img src='${thumbnail_link}' style={{width: '200px' ,display: 'inline-block'}}/><br>`
            }
            insertHtmlAtPositionInMail(
                ret+`<a href=https://share.vidyard.com/watch/${videoPlayerId}>Play</a>`
            );
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setInitialX(e.clientX - currentX);
        setInitialY(e.clientY - currentY);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            setCurrentX(e.clientX - initialX);
            setCurrentY(e.clientY - initialY);
        }
    };

    const toggleIcon = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    };

    const Constraints = {
        aspectRatio: aspectR,
    };
    const startCountdown = async () => {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' });
            console.log(permissionStatus);
            if (permissionStatus.state === 'granted') {
                setTime(0);
                setVideoPlayerId('');
                setInit(true);
                await new Promise((r) => setTimeout(r, 2000)); // to let the camera initialize
                setRecordedChunks([]);
                setCountdown(true);
            } else {
                throw Error('please provide permission to use camera');
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleStartCaptureClick = React.useCallback(() => {
        setCountdown(false);
        setCountTimer(0);
        setCapturing(true);
        setPrev('');
        setIconsVisible(true);
        try {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: 'video/webm',
            });
            mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
            mediaRecorderRef.current.start();
        } catch (err) {
            alert('some error occured while recording please try again');
        }
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
        setInit(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleShare = async (file, videoTitle, directoryName) => {
        try {
            console.log(file, 'file in handle share');
            videoTitle = replaceInvalidCharacters(videoTitle + `_${Date.now()}`);
            const formData = new FormData();
            formData.append('data', file, `${videoTitle}.webm`);
            const customHeaders = new Headers();
            customHeaders.append('title', videoTitle);
            customHeaders.append('directory_name', directoryName);
            customHeaders.append('type', 'webm');
            customHeaders.append(
                'authorization',
                `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
            );
            customHeaders.append('title1', videoTitle);
            setIsUploading(true);
            const loadingObj = toast.loading('uploading video...');
            var response = await fetch(API_ENDPOINTS.vidyardUpload, {
                method: 'POST',
                headers: customHeaders,
                body: formData,
            });
            response = await response.json();
            console.log(response, 'response of video ');
            toast.success('video uploaded,encoding in progress', {
                id: loadingObj,
            });
            setIsUploading(false);
            setUrlAtHome(`https://play.vidyard.com/${response.facade_player_uuid}`);
            setVideoPlayerId(response.facade_player_uuid);
            setVideoId(response.id);
            console.log('the response after vidyard upload request', response);
            setGlobalRefresh(true);
        } catch (err) {
            toast.dismiss();
            console.log(err, 'err of video upload');
            toast.error('could not upload');
        }
    };

    const preview = () => {
        if (prev != '') {
            setPrev('');
            toggleIcon();
            return;
        }
        if (bloburl) {
            setPrev(bloburl);
        }
        toggleIcon();
    };

    useEffect(() => {
        let intervalId;
        if (capturing) {
            intervalId = setInterval(() => setTime(time + 1), 1000);
            if (time == 60) {
                handleStopCaptureClick();
            }
        }
        return () => clearInterval(intervalId);
    }, [capturing, time]);

    useEffect(() => {
        let intervalId;
        if (countdown) {
            intervalId = setInterval(() => setCountTimer(countTimer + 1), 1000);
            if (countTimer == 3) {
                handleStartCaptureClick();
            }
        }
        return () => clearInterval(intervalId);
    }, [countdown, countTimer]);

    useEffect(() => {
        if (recordedChunks.length) {
            console.log('handle share is called');
            handleShare(getCurrentDateTimeString(), 'Media');
        }
    }, [recordedChunks]);

    useEffect(() => {
        if (capturing) {
            setIconsVisible(true); 
        }
    }, [capturing]);

    const handleDownload = React.useCallback(() => {
        if (bloburl) {
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = bloburl;
            a.target = '_blank';
            a.download = 'Skoop video.webm';
            a.click();
            window.URL.revokeObjectURL(bloburl);
        }
    }, [bloburl]);

    const handleClick2 = () => {
        if (capturing) {
            setPrev('');
            sendMessageToBackgroundScript({ action: 'stopRecording' }, handleVideoBlob);
        } else {
            sendMessageToBackgroundScript({
                action: 'startRecording',
                height: aspectRatio[0] * videoResizeConstant,
                width: aspectRatio[1] * videoResizeConstant,
            });
        }
        setCapturing(!capturing);
    };

    function sendMessageToBackgroundScript(request, callback) {
        chrome.runtime.sendMessage(request, (response) => {
            if (callback && response) {
                callback(response);
            }
        });
    }
    async function getBlobFromUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const blob = await response.blob();
            url = URL.createObjectURL(blob);
            setBlobUrl(url);
            return blob;
        } catch (error) {
            console.error('Error fetching blob:', error);
        }
    }

    function handleVideoBlob(response) {
        if (response.videoBlob) {
            getBlobFromUrl(response.url).then((blob) => {
                console.log('Retrieved Blob:', blob);
                handleShare(blob, getCurrentDateTimeString(), 'New');
            });
        }
    }

    const displayForPreview = () => {
        if (prev == '' || capturing) return 'none';
        return 'inline-block';
    };


    return (
        <div className='video-recorder'>
            <div>
                <Toaster position="top-right" />
                {!countdown && (
                    <>
                        <button
                            variant="outlined"
                            color={capturing ? 'secondary' : 'primary'}
                            onClick={handleClick2}
                            size="small"
                            disabled={isUploading}
                            id="skoop_record_button"
                        >
                            {capturing ? 'Stop' : 'Rec'}
                        </button>
                        <button className="btn btn-link" onClick={toggleVideoSettings}>
                            <MdOutlineVideoSettings className="icon-style-normal" />
                        </button>
                        <div className={`dropdown-menu ${videoSettingsOpen ? 'show' : ''}`}>
                            <button
                                className={`dropdown-item ${
                                    selectedVideoStyle === 'Vertical Mode' ? 'active' : ''
                                }`}
                                onClick={() => handleVideoStyleSelect('Vertical Mode')}
                            >
                                Vertical (9:16)
                            </button>
                            <button
                                className={`dropdown-item ${
                                    selectedVideoStyle === 'Horizontal' ? 'active' : ''
                                }`}
                                onClick={() => handleVideoStyleSelect('Horizontal')}
                            >
                                Horizontal (16:9)
                            </button>
                            <button
                                className={`dropdown-item ${
                                    selectedVideoStyle === 'Square' ? 'active' : ''
                                }`}
                                onClick={() => handleVideoStyleSelect('Square')}
                            >
                                Square (1:1)
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div>
                <div
                    style={{
                        position: 'fixed',
                        cursor: 'move',
                        transform: `translate(${currentX}px, ${currentY}px)`,
                        textAlign: 'center',
                    }}
                    onMouseDown={handleMouseDown}
                >
                    {countdown && (
                        <div className="text-center">
                            <h1 className="customH1">{3 - countTimer}</h1>
                        </div>
                    )}
                    {init === true && (
                        <div className="card Cardstyle">
                            <Webcam
                                audio={true}
                                ref={webcamRef}
                                videoConstraints={Constraints}
                                muted
                                className="customWebcam"
                            />
                            <h4>{`Time remaining: ${60 - time} Seconds`}</h4>
                        </div>
                    )}
                </div>
                <div>
                    {!capturing && !isUploading && bloburl && (
                        <>
                            {iconsVisible && (
                                <div className="options">
                                    <button
                                        data-mdb-toggle="tooltip"
                                        data-mdb-placement="bottom"
                                        title="Download the recorded video"
                                        className="videoOption"
                                        onClick={handleDownload}
                                    >
                                        <FaDownload id="mail_icons" />
                                    </button>

                                    <button
                                        data-mdb-toggle="tooltip"
                                        data-mdb-placement="bottom"
                                        title={
                                            isPlaying
                                                ? 'Close the Preview video'
                                                : 'Play the recorded video'
                                        }
                                        className="videoOption"
                                        onClick={preview}
                                    >
                                        {isPlaying ? (
                                            <FaTimesCircle id="mail_icons" />
                                        ) : (
                                            <FaRegCirclePlay id="mail_icons" />
                                        )}
                                    </button>

                                    <button
                                        data-mdb-toggle="tooltip"
                                        data-mdb-placement="bottom"
                                        title="Delete the video"
                                        className="delete"
                                        onClick={() => {
                                            setPrev('');
                                            setRecordedChunks([]);
                                        }}
                                    >
                                        <MdDeleteForever id="mail_icons" />
                                    </button>

                                    {videoPlayerId !== '' && (
                                        <>
                                            <button
                                                className="videoOption"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="bottom"
                                                title="Export to text area"
                                                onClick={handleInsertion}
                                            >
                                                <MdOutlineSendTimeExtension id="mail_icons" />
                                            </button>

                                            <button
                                                className="videoOption"
                                                onClick={() => {
                                                    setIconsVisible(false);
                                                }}
                                            >
                                                <AiOutlineClose id="mail_icons"/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div>
                    {prev != '' && (
                        <div className="previewCard">
                            {prev !== '' && (
                                <div className="card">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <video
                                            className="embed-responsive-item customDynamicDisplay"
                                            src={prev}
                                            style={{ display: `${displayForPreview()}` }}
                                            autoPlay
                                            muted
                                            loop
                                            controls
                                        ></video>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordingButton;
