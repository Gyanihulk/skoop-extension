import React, { useState, useEffect, useContext, useRef } from 'react';
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
import MessageContext from '../../contexts/MessageContext.js';
import RenameVideoPopup from '../Library/RenameVideoPopup.js';
import { FaEdit } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const videoResizeConstant = 25;
const RecordingButton = (continuousCanvasRefProp) => {
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
    const [videoTitle, setVideoTitle] = useState('');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [uploadedVideoName, setUploadedVideoName] = useState('');

    const { setGlobalRefresh, isLinkedin, selectedChatWindows, focusedElementId } =
        useContext(GlobalStatesContext);
    const { getThumbnail, deleteVideo } = useContext(MediaUtilsContext);
    const { message, addMessage } = useContext(MessageContext);
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

    const addToMessage = async (videoPlayerId) => {
        if (isLinkedin) {
            addMessage(
                `https://skoop.hubs.vidyard.com/watch/${videoPlayerId}`
                // ?email=${JSON.parse(localStorage.getItem('skoopUsername'))}&duration=60
            );
        } else {
            const thumbnail_link = await getThumbnail(videoId);
            var ret = '';
            if (thumbnail_link != undefined && thumbnail_link != null) {
                ret = `<img src='${thumbnail_link}' class="inline-block-width"/><br>`;
            }
            addMessage(
                ret + `<a href=https://skoop.hubs.vidyard.com/watch/${videoPlayerId}>Play</a>`
            );
        }
        window.scrollTo(0, document.body.scrollHeight);
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

    const handleDeleteVideo = async () => {
        const isDeleted = await deleteVideo(videoId);
        if (isDeleted) {
            setIconsVisible(false);
        }
    };

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
            // setPrev(url);
            return blob;
        } catch (error) {
            console.error('Error fetching blob:', error);
        }
    }

    function handleVideoBlob(response) {
        if (response.videoBlob) {
            getBlobFromUrl(response.url).then((blob) => {
                uploadVideo(blob, getCurrentDateTimeString(), 'New');
            });
        }
    }

    const capturingRef = useRef(capturing);
    let stopTimeoutId;

    const startVideoCapture = (restart = false,event) => {
        if (event) {
            event.stopPropagation();
        }
        let height, width;
        if (selectedVideoStyle === 'Square') {
            height = width = 10 * videoResizeConstant;
        } else if (selectedVideoStyle === 'Vertical Mode') {
            height = 16 * videoResizeConstant;
            width = 9 * videoResizeConstant;
        } else {
            height = 9 * videoResizeConstant;
            width = 16 * videoResizeConstant;
        }

        if (capturing) {
            if (restart) {
                
                sendMessageToBackgroundScript({ action: 'stopRecording' });
                sendMessageToBackgroundScript({
                    action: 'startRecording',
                    height,
                    width,
                });
                clearTimeout(stopTimeoutId);

                // Restart the timer
                stopTimeoutId = setTimeout(() => {
                    if (capturingRef.current) {
                        setPrev('');
                        sendMessageToBackgroundScript({ action: 'stopRecording' }, handleVideoBlob);
                        setCapturing(false);
                    }
                }, 95000);
            } else {
                clearTimeout(stopTimeoutId);
                setPrev('');
                sendMessageToBackgroundScript({ action: 'stopRecording' }, handleVideoBlob);
                setCapturing(false);
            }
        } else {
            sendMessageToBackgroundScript({
                action: 'startRecording',
                height,
                width,
            });
            setCapturing(true);

            stopTimeoutId = setTimeout(() => {
                if (capturingRef.current) {
                    setPrev('');
                    sendMessageToBackgroundScript({ action: 'stopRecording' }, handleVideoBlob);
                    setCapturing(false);
                }
            }, 95000);
        }
    };
    
    useEffect(() => {
        capturingRef.current = capturing;
    }, [capturing]);

    const uploadVideo = async (file, videoTitle, directoryName) => {
        try {
            videoTitle = replaceInvalidCharacters(videoTitle + `_${Date.now()}`);
            setVideoTitle(videoTitle);
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
            const loadingObj = toast.loading('Uploading Video...');
            var response = await fetch(API_ENDPOINTS.vidyardUpload, {
                method: 'POST',
                headers: customHeaders,
                body: formData,
            });
            response = await response.json();
            toast.success('Link Added to Custom Message', {
                id: loadingObj,
            });
            setIsUploading(false);
            setVideoPlayerId(response.facade_player_uuid);
            setVideoId(response.id);
            addToMessage(response.facade_player_uuid);
            setGlobalRefresh(true);

            // Set the uploaded video name in the state
            setUploadedVideoName(response.name);
        } catch (err) {
            toast.dismiss();
            toast.error('could not upload');
        }
        window.scrollTo(0, document.body.scrollHeight);
    };

    useEffect(() => {
        setVideoTitle(videoTitle);
    }, [capturing]);

    //rename modal

    const handleRenameClick = () => {
        setNewVideoTitle(uploadedVideoName);
        setShowRenameModal(true);
    };

    // Function to close the rename modal
    const handleCloseRenameModal = () => {
        setShowRenameModal(false);
    };

    const handleRenameSave = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.renameVideo + `/${videoId}`, {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    newTitle: newVideoTitle,
                }),
            });

            if (response.ok) {
                setVideoTitle(newVideoTitle);
                setUploadedVideoName(newVideoTitle);
                handleCloseRenameModal();
                toast.success('Video renamed successfully');
            } else {
                toast.error('Failed to rename video.');
            }
        } catch (error) {
            toast.error('Failed to rename video.');
        }
    };

    return (
        <>
            <div className="pt-3">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-auto">
                            {!countdown && (
                                <>
                                    {capturing && (
                                        <button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={(e) => startVideoCapture(true, e)}
                                            size="small"
                                            disabled={!capturing || isUploading}
                                            title="Record Video"
                                            id="skoop_record_button"
                                        >
                                            Restart
                                        </button>
                                    )}
                                    <button
                                        variant="outlined"
                                        color={capturing ? 'secondary' : 'primary'}
                                        onClick={(e) => startVideoCapture(false, e)}
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
                                    <div
                                        className={`dropdown-menu ${
                                            videoSettingsOpen ? 'show' : ''
                                        }`}
                                    >
                                        <button
                                            className={`dropdown-item ${
                                                selectedVideoStyle === 'Vertical Mode'
                                                    ? 'active'
                                                    : ''
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
                            <VoiceVisualization
                                setIconsVisible={setIconsVisible}
                                setBlobUrl={setBlobUrl}
                                setIsUploading={setIsUploading}
                                setCapturing={setCapturing}
                                setVideoPlayerId={setVideoPlayerId}
                                setVideoId={setVideoId}
                                addToMessage={addToMessage}
                            />
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="row justify-content-center">
                        {!capturing && !isUploading && bloburl && iconsVisible && (
                            <div class="col-auto">
                                {uploadedVideoName !== '' && (
                                    <div className="d-flex align-items-center">
                                        <h7 className="text-truncate uploadedvideotitle">
                                            {uploadedVideoName}
                                        </h7>
                                        <button
                                            className="btn btn-link ml-2"
                                            onClick={handleRenameClick}
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                )}
                                <button
                                    data-mdb-toggle="tooltip"
                                    data-mdb-placement="bottom"
                                    title="copy the video link"
                                    className="videoOption"
                                    onClick={() => {
                                        handleCopyToClipboard(
                                            `https://skoop.hubs.vidyard.com/watch/${videoPlayerId}`
                                        );
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
                                    title="Download the recorded video"
                                    className="videoOption"
                                    onClick={handleDownload}
                                >
                                    <FaDownload id="mail_icons" />
                                </button>

                                <button
                                    data-mdb-toggle="tooltip"
                                    data-mdb-placement="bottom"
                                    title="Delete the video"
                                    className="delete"
                                    onClick={handleDeleteVideo}
                                >
                                    <MdDeleteForever id="mail_icons" />
                                </button>

                                {videoPlayerId !== '' && (
                                    <>
                                        {/* <button
                                                className="videoOption"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="bottom"
                                                title="Export to text area"
                                                onClick={handleInsertion}
                                            >
                                                <MdOutlineSendTimeExtension id="mail_icons" />
                                            </button> */}

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
                        {showRenameModal && (
                            <RenameVideoPopup
                                newTitle={newVideoTitle}
                                onClose={handleCloseRenameModal}
                                onSave={handleRenameSave}
                                onTitleChange={(e) => setNewVideoTitle(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {prev !== '' && <PreviewModal prev={prev} preview={preview} setPrev={setPrev} />}
            </div>
        </>
    );
};

export default RecordingButton;
