import React, { useState, useEffect, useContext } from 'react';
import API_ENDPOINTS from '../apiConfig.js';
import { FaDownload } from 'react-icons/fa6';
import { FaTimesCircle } from 'react-icons/fa';
import { FaRegCirclePlay } from 'react-icons/fa6';
import {
    MdDeleteForever,
    MdOutlineVideoSettings,
    MdOutlineSendTimeExtension,
} from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';

import {
    getCurrentDateTimeString,
    handleCopyToClipboard,
    insertHtmlAtPositionInMail,
    insertIntoLinkedInMessageWindow,
    replaceInvalidCharacters,
} from '../../utils/index.js';
import GlobalStatesContext from '../../contexts/GlobalStates.js';
import toast from 'react-hot-toast';
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js';
import VoiceVisualization from '../AudioRecording/index.js';
import PreviewModal from '../PreviewModal/PreviewModal.jsx';
import { IoLink } from 'react-icons/io5';
const videoResizeConstant = 25;
const RecordingButton = () => {
    const [capturing, setCapturing] = useState(false);
    const [prev, setPrev] = useState('');
    const [time, setTime] = useState(0);
    const [videoPlayerId, setVideoPlayerId] = useState('');
    const [videoId, setVideoId] = useState('');
    const [countdown, setCountdown] = useState(false);
    const [countTimer, setCountTimer] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [bloburl, setBlobUrl] = useState(null);
    const [aspectRatio, setAspectRatio] = useState([9, 16]);
    const [videoSettingsOpen, setVideoSettingsOpen] = useState(false);
    const [selectedVideoStyle, setSelectedVideoStyle] = useState('Vertical Mode');
    const [iconsVisible, setIconsVisible] = useState(true);

    const { setGlobalRefresh, isLinkedin, selectedChatWindows } = useContext(GlobalStatesContext);
    const { getThumbnail } = useContext(MediaUtilsContext);

    const handleVideoStyleSelect = (style) => {
        setSelectedVideoStyle(style);
        if (style === 'Square') {
            setAspectRatio([10, 10]);
        } else if (style === 'Vertical Mode') {
            setAspectRatio([16, 9]);
        } else {
            setAspectRatio([9, 16]);
        }
        toggleVideoSettings();
        console.log(`Selected Video Style: ${style}`);
    };
    const toggleVideoSettings = () => {
        setVideoSettingsOpen(!videoSettingsOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (videoSettingsOpen && !event.target.closest('.dropdown-menu')) {
                setVideoSettingsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [videoSettingsOpen]);

    const handleIconClick = (event) => {
        event.stopPropagation();
        toggleVideoSettings();
    };

    const handleInsertion = async () => {
        console.log(isLinkedin, 'test linkedin ');
        if (isLinkedin) {
            insertIntoLinkedInMessageWindow(
                `<p>https://share.vidyard.com/watch/${videoPlayerId}</p>`,
                selectedChatWindows
            );
        } else {
            const thumbnail_link = await getThumbnail(videoId);
            var ret = '';
            if (thumbnail_link != undefined && thumbnail_link != null) {
                ret = `<img src='${thumbnail_link}' style={{width: '200px' ,display: 'inline-block'}}/><br>`;
            }
            insertHtmlAtPositionInMail(
                ret + `<a href=https://share.vidyard.com/watch/${videoPlayerId}>Play</a>`
            );
        }
    };



    const toggleIcon = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
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
          
        }
        return () => clearInterval(intervalId);
    }, [capturing, time]);

    useEffect(() => {
        let intervalId;
        if (countdown) {
            intervalId = setInterval(() => setCountTimer(countTimer + 1), 1000);
        }
        return () => clearInterval(intervalId);
    }, [countdown, countTimer]);

    useEffect(() => {
        if (capturing) {
            setIconsVisible(true);
        }
    }, [capturing]);

    //useable functions
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

    const startVideoCapture = () => {
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
    return (
        <>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-auto">
                        {!countdown && (
                            <>
                                <button
                                    variant="outlined"
                                    color={capturing ? 'secondary' : 'primary'}
                                    onClick={startVideoCapture}
                                    size="small"
                                    disabled={isUploading}
                                    title="Record Video"
                                    id="skoop_record_button"
                                >
                                    {capturing ? 'Stop' : 'Rec'}
                                </button>
                                <button className="btn btn-link" onClick={handleIconClick}>
                                    <MdOutlineVideoSettings
                                        className="icon-style-normal"
                                        title="Select the video orientation/Aspect Ratio"
                                    />
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
                    <div class="col-auto">
                        <VoiceVisualization setIconsVisible={setIconsVisible} setBlobUrl={setBlobUrl} setIsUploading={setIsUploading} setCapturing={setCapturing}/>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row justify-content-center">
                    {!capturing && !isUploading && bloburl && iconsVisible && (
                                <div class="col-auto">
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
                                        title="copy the video link"
                                        className="videoOption"
                                        onClick={() => {
                                            handleCopyToClipboard(`https://share.vidyard.com/watch/${videoPlayerId}`)
                                        }}
                                    >
                                        <IoLink id="mail_icons" />
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
                                                <AiOutlineClose id="mail_icons" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                </div>
            </div>

            {prev !== '' && <PreviewModal prev={prev} preview={preview} setPrev={setPrev} />}
        </>
    );
};

export default RecordingButton;
