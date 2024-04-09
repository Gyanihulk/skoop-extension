import React, { useState, useEffect, useContext, useRef } from "react";
import API_ENDPOINTS from "../apiConfig.js";
import { FaDownload } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import {
  MdDeleteForever,
  MdOutlineVideoSettings,
  MdOutlineSendTimeExtension,
} from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

import {
  getCurrentDateTimeString,
  handleCopyToClipboard,
  insertHtmlAtPositionInMail,
  insertIntoLinkedInMessageWindow,
  replaceInvalidCharacters,
} from "../../utils/index.js";
import GlobalStatesContext from "../../contexts/GlobalStates.js";
import toast from "react-hot-toast";
import MediaUtilsContext from "../../contexts/MediaUtilsContext.js";
import VoiceVisualization from "../AudioRecording/index.js";

import { IoLink } from "react-icons/io5";
import MessageContext from "../../contexts/MessageContext.js";
import RenameVideoPopup from "../Library/RenameVideoPopup.js";

import { IoMdClose } from "react-icons/io";
import Vertical from "../SVG/Vertical.jsx";
import Horizontal from "../SVG/Horizontal.jsx";
import Square from "../SVG/Square.jsx";

const videoResizeConstant = 32;
const RecordingButton = () => {
  const [capturing, setCapturing] = useState(false);
  const [prev, setPrev] = useState("");
  const [time, setTime] = useState(0);
  const [countdown, setCountdown] = useState(false);
  const [countTimer, setCountTimer] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [bloburl, setBlobUrl] = useState(null);
  const [height, setHeight] = useState(16 * videoResizeConstant);
  const [width, setWidth] = useState(9 * videoResizeConstant);
  const [videoSettingsOpen, setVideoSettingsOpen] = useState(false);
  const [selectedVideoStyle, setSelectedVideoStyle] = useState("Vertical Mode");

  const { setGlobalRefresh, setLatestVideo, setLatestBlob } =
    useContext(GlobalStatesContext);
  const { uploadVideo } = useContext(MediaUtilsContext);
  const { addToMessage } = useContext(MessageContext);
  const handleVideoStyleSelect = (style) => {
    setSelectedVideoStyle(style);
    if (style === "Square") {
      setHeight(10 * videoResizeConstant);
      setWidth(10 * videoResizeConstant);
    } else if (style === "Vertical Mode") {
      setHeight(16 * videoResizeConstant);
      setWidth(9 * videoResizeConstant);
    } else {
      setWidth(16 * videoResizeConstant);
      setHeight(9 * videoResizeConstant);
    }
    toggleVideoSettings();
  };
  const toggleVideoSettings = () => {
    setVideoSettingsOpen(!videoSettingsOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (videoSettingsOpen && !event.target.closest(".dropdown-menu")) {
        setVideoSettingsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [videoSettingsOpen]);

  const handleIconClick = (event) => {
    event.stopPropagation();
    toggleVideoSettings();
  };

  const preview = () => {
    if (prev != "") {
      setPrev("");
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

  //useable functions

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
      console.error("Error fetching blob:", error);
    }
  }

  function handleVideoBlob(response) {
    if (response.error) {
      setIsUploading(false);
      setCapturing(false);
    }
    if (response.videoBlob) {
      getBlobFromUrl(response.url).then(async (blob) => {
        setLatestBlob(blob);
        setIsUploading(true);
        const response = await uploadVideo(
          blob,
          getCurrentDateTimeString(),
          "New",
          height,
          width
        );
        setIsUploading(false);
        setLatestVideo(response);
        addToMessage(
          response.facade_player_uuid,
          response?.urlForThumbnail,
          response?.name
        );
        setGlobalRefresh(true);
        setCapturing(false);
      });
    }
  }

  const startVideoCapture = async (restart = false, event) => {
    if (event) {
      event.stopPropagation();
    }
    if (capturing) {
      return;
    }
    setLatestVideo(null);
    setLatestBlob(null);
    sendMessageToBackgroundScript(
      {
        action: "startRecording",
        height,
        width,
      },
      handleVideoBlob
    );
    setCapturing(true);
  };
  return (
    <>
      <div id="recording-container">
        <div class="container">
          <div class="row justify-content-center px-3">
            <div class="col-auto">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="d-flex flex-column"
                  variant="outlined"
                  color={capturing ? "secondary" : "primary"}
                  onClick={(e) => startVideoCapture(false, e)}
                  size="small"
                  disabled={isUploading}
                  title="Record Video"
                  id="skoop_record_button"
                >
                  <span class="icon">
                    {capturing ? (
                      <svg
                        width="12"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#E31A1A" />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 40 40"
                        fill="currentcolor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M17.5452 15.0455V24.3788C17.5452 24.9255 18.1719 25.2455 18.6119 24.9121L24.8386 20.2455C25.1986 19.9788 25.1986 19.4455 24.8386 19.1788L18.6119 14.5121C18.1719 14.1788 17.5452 14.4988 17.5452 15.0455ZM18.8786 8.0188C18.8786 7.16546 18.0919 6.51213 17.2652 6.6988C15.7719 7.04546 14.3586 7.63213 13.1052 8.43213C12.3986 8.88546 12.2919 9.8988 12.8919 10.4988C13.3186 10.9255 13.9986 11.0321 14.5052 10.7121C15.5319 10.0588 16.6652 9.5788 17.8919 9.31213C18.4786 9.1788 18.8786 8.63213 18.8786 8.0188ZM11.0119 12.3921C10.3986 11.7921 9.39855 11.8855 8.94522 12.6055C8.14522 13.8588 7.55855 15.2721 7.21189 16.7655C7.02522 17.5921 7.66522 18.3788 8.51855 18.3788C9.11855 18.3788 9.67855 17.9788 9.79855 17.3921C10.0652 16.1788 10.5586 15.0321 11.1986 14.0188C11.5452 13.4988 11.4386 12.8188 11.0119 12.3921ZM8.51855 21.0455C7.66522 21.0455 7.01189 21.8321 7.19855 22.6588C7.54522 24.1521 8.13189 25.5521 8.93189 26.8188C9.38522 27.5388 10.3986 27.6321 10.9986 27.0321C11.4252 26.6055 11.5319 25.9255 11.1986 25.4188C10.5452 24.4055 10.0652 23.2721 9.79855 22.0455C9.67855 21.4455 9.13189 21.0455 8.51855 21.0455ZM13.1052 30.9788C14.3719 31.7788 15.7719 32.3655 17.2652 32.7121C18.0919 32.8988 18.8786 32.2455 18.8786 31.4055C18.8786 30.8055 18.4786 30.2455 17.8919 30.1255C16.6786 29.8588 15.5319 29.3655 14.5186 28.7255C13.9986 28.4055 13.3319 28.4988 12.9052 28.9388C12.2919 29.5255 12.3852 30.5255 13.1052 30.9788ZM33.5452 19.7121C33.5452 26.0188 29.1452 31.3255 23.2386 32.6988C22.4119 32.8988 21.6119 32.2455 21.6119 31.3921C21.6119 30.7788 22.0252 30.2455 22.6119 30.0988C27.3452 29.0055 30.8786 24.7655 30.8786 19.7121C30.8786 14.6588 27.3452 10.4188 22.6119 9.32546C22.0252 9.19213 21.6119 8.64546 21.6119 8.03213C21.6119 7.1788 22.4119 6.52546 23.2386 6.72546C29.1452 8.0988 33.5452 13.4055 33.5452 19.7121Z"
                          fill="#2D68C4"
                        />
                      </svg>
                    )}
                  </span>
                </div>

                <span className="d-flex flex-row record-button-bottom-text">
                  {" "}
                  {capturing
                    ? isUploading
                      ? "Uploading..."
                      : "Recording..."
                    : "Record Video"}{" "}
                  <div
                    className="d-flex flex-column justify-content-center ps-1 cursor-pointer"
                    onClick={handleIconClick}
                  >
                    <svg
                      width="16"
                      height="16"
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
                setBlobUrl={setBlobUrl}
                setIsUploading={setIsUploading}
                setCapturing={setCapturing}
                addToMessage={addToMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal"
        style={{ display: videoSettingsOpen ? "block" : "none" }}
      >
        <div className="modal-overlay modal-dialog-centered" role="document">
          <div className="modal-content mx-4 justify-content-center align-items-center">
            <div className="modal-header d-flex justify-content-between w-100 px-3 pt-3 pb-2">
              Video settings
              <button
                type="button"
                className="custom-close-button"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <IoMdClose size={16} />
              </button>
            </div>
            <div className="modal-body d-flex flex-row align-items-center justify-content-center">
              <div className="text-center">
                <div
                  className={` mx-3 p-2 border-video-selector ${
                    selectedVideoStyle == "Vertical Mode"
                      ? "bg-selected-videoMode"
                      : ""
                  }`}
                  onClick={() => handleVideoStyleSelect("Vertical Mode")}
                >
                  <Vertical />
                </div>
                <span className="record-button-bottom-text">
                  Vertical (9:16)
                </span>
              </div>
              <div className="text-center">
                <div
                  className={` mx-3 p-2 border-video-selector ${
                    selectedVideoStyle == "Horizontal"
                      ? "bg-selected-videoMode"
                      : ""
                  }`}
                  onClick={() => handleVideoStyleSelect("Horizontal")}
                >
                  <Horizontal />
                </div>
                <span className="record-button-bottom-text">
                  Horizontal (9:16){" "}
                </span>
              </div>
              <div className="text-center">
                <div
                  className={` mx-3 p-2 border-video-selector ${
                    selectedVideoStyle == "Square"
                      ? "bg-selected-videoMode"
                      : ""
                  }`}
                  onClick={() => handleVideoStyleSelect("Square")}
                >
                  <Square />
                </div>
                <span className="record-button-bottom-text">Square (1:1)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordingButton;
