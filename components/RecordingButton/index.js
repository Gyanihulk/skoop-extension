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
import Vertical from '../VideoScreenLayoutSVG/Vertical.jsx';
import Horizontal from '../VideoScreenLayoutSVG/Horizontal.jsx';
import Square from '../VideoScreenLayoutSVG/Square.jsx';

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
    const [videoTitle, setVideoTitle] = useState('');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [uploadedVideoName, setUploadedVideoName] = useState('');

    const { setGlobalRefresh, isLinkedin, selectedChatWindows, focusedElementId } =
        useContext(GlobalStatesContext);
    const { getThumbnail, deleteVideo } = useContext(MediaUtilsContext);
    const { message, addMessage } = useContext(MessageContext);
    const handleVideoStyleSelect = (style) => {
        console.log(style)
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

    const startVideoCapture = (restart = false, event) => {
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
            toast.success('Video link Added to Custom Message', {
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
                    <div class="row justify-content-between px-5">
                        <div class="col-auto">
                            <div className="d-flex flex-column">
                                {!countdown && (
                                    <>
                                        <div
                                            className="d-flex flex-column"
                                            variant="outlined"
                                            color={capturing ? 'secondary' : 'primary'}
                                            onClick={(e) => startVideoCapture(false, e)}
                                            size="small"
                                            disabled={isUploading}
                                            title="Record Video"
                                            id="skoop_record_button"
                                        >
                                            {capturing && (
                                                <button
                                                    className="btn btn-outline-warning "
                                                    onClick={(e) => startVideoCapture(true, e)}
                                                    size="small"
                                                    disabled={!capturing || isUploading}
                                                    title="Record Video"
                                                >
                                                    Restart
                                                </button>
                                            )}
                                            <span class="icon">
                                                {capturing ? (
                                                    <button
                                                        className="btn btn-outline-warning "
                                                        size="small"
                                                        disabled={!capturing || isUploading}
                                                        title="Record Video"
                                                    >
                                                        Stop
                                                    </button>
                                                ) : (
                                                    <svg
                                                        width="60"
                                                        height="60"
                                                        viewBox="0 0 60 60"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M25.5681 22.5681V36.5681C25.5681 37.3881 26.5081 37.8681 27.1681 37.3681L36.5081 30.3681C37.0481 29.9681 37.0481 29.1681 36.5081 28.7681L27.1681 21.7681C26.5081 21.2681 25.5681 21.7481 25.5681 22.5681ZM27.5681 12.0281C27.5681 10.7481 26.3881 9.76808 25.1481 10.0481C22.9081 10.5681 20.7881 11.4481 18.9081 12.6481C17.8481 13.3281 17.6881 14.8481 18.5881 15.7481C19.2281 16.3881 20.2481 16.5481 21.0081 16.0681C22.5481 15.0881 24.2481 14.3681 26.0881 13.9681C26.9681 13.7681 27.5681 12.9481 27.5681 12.0281ZM15.7681 18.5881C14.8481 17.6881 13.3481 17.8281 12.6681 18.9081C11.4681 20.7881 10.5881 22.9081 10.0681 25.1481C9.78807 26.3881 10.7481 27.5681 12.0281 27.5681C12.9281 27.5681 13.7681 26.9681 13.9481 26.0881C14.3481 24.2681 15.0881 22.5481 16.0481 21.0281C16.5681 20.2481 16.4081 19.2281 15.7681 18.5881ZM12.0281 31.5681C10.7481 31.5681 9.76807 32.7481 10.0481 33.9881C10.5681 36.2281 11.4481 38.3281 12.6481 40.2281C13.3281 41.3081 14.8481 41.4481 15.7481 40.5481C16.3881 39.9081 16.5481 38.8881 16.0481 38.1281C15.0681 36.6081 14.3481 34.9081 13.9481 33.0681C13.7681 32.1681 12.9481 31.5681 12.0281 31.5681ZM18.9081 46.4681C20.8081 47.6681 22.9081 48.5481 25.1481 49.0681C26.3881 49.3481 27.5681 48.3681 27.5681 47.1081C27.5681 46.2081 26.9681 45.3681 26.0881 45.1881C24.2681 44.7881 22.5481 44.0481 21.0281 43.0881C20.2481 42.6081 19.2481 42.7481 18.6081 43.4081C17.6881 44.2881 17.8281 45.7881 18.9081 46.4681ZM49.5681 29.5681C49.5681 39.0281 42.9681 46.9881 34.1081 49.0481C32.8681 49.3481 31.6681 48.3681 31.6681 47.0881C31.6681 46.1681 32.2881 45.3681 33.1681 45.1481C40.2681 43.5081 45.5681 37.1481 45.5681 29.5681C45.5681 21.9881 40.2681 15.6281 33.1681 13.9881C32.2881 13.7881 31.6681 12.9681 31.6681 12.0481C31.6681 10.7681 32.8681 9.78807 34.1081 10.0881C42.9681 12.1481 49.5681 20.1081 49.5681 29.5681Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                )}
                                            </span>

                                            {/* {capturing ? 'Stop' : 'Rec'} */}
                                        </div>
                                    </>
                                )}
                                <span className="d-flex flex-row record-button-bottom-text">
                                    {' '}
                                    Record video{' '}
                                    <div
                                        className="d-flex flex-column justify-content-center ps-1"
                                        onClick={handleIconClick}
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15 16.5H10.5C10.2875 16.5 10.1094 16.4281 9.96565 16.2844C9.8219 16.1406 9.75002 15.9625 9.75002 15.75V11.25C9.75002 11.0375 9.8219 10.8594 9.96565 10.7156C10.1094 10.5719 10.2875 10.5 10.5 10.5H15C15.2125 10.5 15.3906 10.5719 15.5344 10.7156C15.6782 10.8594 15.75 11.0375 15.75 11.25V12.75L17.25 11.25V15.75L15.75 14.25V15.75C15.75 15.9625 15.6782 16.1406 15.5344 16.2844C15.3906 16.4281 15.2125 16.5 15 16.5ZM9.03752 6.375C8.31252 6.375 7.69377 6.63125 7.18127 7.14375C6.66877 7.65625 6.41252 8.275 6.41252 9C6.41252 9.6 6.58127 10.125 6.91877 10.575C7.25627 11.025 7.70002 11.3375 8.25002 11.5125V9.825C8.15002 9.725 8.06877 9.59688 8.00627 9.44063C7.94377 9.28438 7.91252 9.1375 7.91252 9C7.91252 8.6875 8.0219 8.42188 8.24065 8.20313C8.4594 7.98438 8.72502 7.875 9.03752 7.875C9.35002 7.875 9.61252 7.98438 9.82502 8.20313C10.0375 8.42188 10.1438 8.6875 10.1438 9H11.6625C11.6625 8.275 11.4063 7.65625 10.8938 7.14375C10.3813 6.63125 9.76252 6.375 9.03752 6.375ZM6.93752 16.5L6.63752 14.1C6.47502 14.0375 6.3219 13.9625 6.17815 13.875C6.0344 13.7875 5.89377 13.6938 5.75627 13.5938L3.52502 14.5313L1.46252 10.9688L3.39377 9.50625C3.38127 9.41875 3.37502 9.33438 3.37502 9.25313V8.74688C3.37502 8.66563 3.38127 8.58125 3.39377 8.49375L1.46252 7.03125L3.52502 3.46875L5.75627 4.40625C5.89377 4.30625 6.03752 4.2125 6.18752 4.125C6.33752 4.0375 6.48752 3.9625 6.63752 3.9L6.93752 1.5H11.0625L11.3625 3.9C11.525 3.9625 11.6782 4.0375 11.8219 4.125C11.9656 4.2125 12.1063 4.30625 12.2438 4.40625L14.475 3.46875L16.5375 7.03125L14.6063 8.49375C14.6188 8.58125 14.625 8.66563 14.625 8.74688V9H13.125C13.1125 8.7625 13.0938 8.55313 13.0688 8.37188C13.0438 8.19063 13.0063 8.01875 12.9563 7.85625L14.5688 6.6375L13.8375 5.3625L11.9813 6.15C11.7063 5.8625 11.4031 5.62188 11.0719 5.42813C10.7407 5.23438 10.3813 5.0875 9.99377 4.9875L9.75002 3H8.26877L8.00627 4.9875C7.61877 5.0875 7.2594 5.23438 6.92815 5.42813C6.5969 5.62188 6.29377 5.85625 6.01877 6.13125L4.16252 5.3625L3.43127 6.6375L5.04377 7.8375C4.98127 8.025 4.93752 8.2125 4.91252 8.4C4.88752 8.5875 4.87502 8.7875 4.87502 9C4.87502 9.2 4.88752 9.39375 4.91252 9.58125C4.93752 9.76875 4.98127 9.95625 5.04377 10.1438L3.43127 11.3625L4.16252 12.6375L6.01877 11.85C6.31877 12.1625 6.65627 12.425 7.03127 12.6375C7.40627 12.85 7.81252 12.9875 8.25002 13.05V16.5H6.93752Z"
                                                fill="#2A2B39"
                                            />
                                        </svg>
                                    </div>
                                </span>
                            </div>
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
            <div
                    className="modal"
                    style={{ display: videoSettingsOpen ? 'block' : 'none' }}
                >
                    <div
                        className="modal-overlay modal-dialog-centered"
                        role="document"
                    >
                        <div className="modal-content mx-4">
                            <div className="modal-header">
                                Video settings
                                <button
                                    type="button"
                                    className="custom-close-button"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                >
                                    <IoMdClose />
                                </button>
                            </div>
                            <div className="modal-body d-flex flex-row justify-content-between px-4 align-items-center">
                                <div className={`p-2 border-video-selector ${selectedVideoStyle=='Vertical Mode'?'bg-selected-videoMode':""}`} onClick={() =>
                                                    handleVideoStyleSelect('Vertical Mode')
                                                }>
                                    <Vertical />
                                </div>
                                <div className={`p-2 border-video-selector ${selectedVideoStyle=='Horizontal'?'bg-selected-videoMode':""}`} onClick={() => handleVideoStyleSelect('Horizontal')}  >
                                    <Horizontal  />
                                </div>
                                <div className={`p-2 border-video-selector ${selectedVideoStyle=='Square'?'bg-selected-videoMode':""}`} onClick={() => handleVideoStyleSelect('Square')}>
                                    <Square   />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default RecordingButton;
