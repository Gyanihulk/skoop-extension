import React, { useState, useEffect, useContext, useRef } from "react";
import { AiFillAudio } from "react-icons/ai";
import { UserInput } from "../UserInput/index.js";
import { FaStop } from "react-icons/fa";

import API_ENDPOINTS from "../apiConfig.js";
import {
  getCurrentDateTimeString,
  replaceInvalidCharacters,
} from "../../utils/index.js";

import GlobalStatesContext from "../../contexts/GlobalStates.js";
import toast from "react-hot-toast";
import MediaUtilsContext from "../../contexts/MediaUtilsContext.js";
import { continuousVisualizer } from "sound-visualizer";

const VoiceVisualization = ({ setIsUploading, addToMessage }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [visualizationUrl, setVisualizationUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTakingInput, setIsTakingInput] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const continuousCanvasRef = useRef(null);

  const { setGlobalRefresh, setLatestVideo, setLatestBlob } =
    useContext(GlobalStatesContext);

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
    if (visualizationUrl != "") {
      handleShare(getCurrentDateTimeString(), "Media");
    }
  }, [visualizationUrl]);

  useEffect(() => {
    if (isRecording && continuousCanvasRef.current) {
      const { start, stop, reset } = continuousVisualizer(
        mediaRecorder.stream,
        continuousCanvasRef.current,
        {}
      );
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
      setIsUploading(true);
      var title1 = audioTitle;
      audioTitle = replaceInvalidCharacters(audioTitle + `_${Date.now()}`);
      const blobres = await fetch(visualizationUrl);
      const blob = await blobres.blob();
      setLatestBlob(blob);

      const formData = new FormData();
      let file = new File([blob], "recording");
      formData.append("data", file, `${audioTitle}.wav`);
      const customHeaders = new Headers();
      formData.append("height", 500);
      formData.append("width", 500);
      customHeaders.append("title", audioTitle);
      customHeaders.append("directory_name", directoryName);
      customHeaders.append("duration", duration);
      customHeaders.append("type", "wav");
      customHeaders.append(
        "authorization",
        `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`
      );
      customHeaders.append("title1", title1);

      const loadingObj = toast.loading("Uploading Voice Memo...");
      var response = await fetch(API_ENDPOINTS.vidyardUploadAudio, {
        method: "POST",
        headers: customHeaders,
        body: formData,
      });
      response = await response.json();
      console.log(response, "from audio");
      toast.success("Voice Memo uploaded,encoding in progress", {
        id: loadingObj,
      });
      setIsUploading(false);
      addToMessage(response.facade_player_uuid);
      setGlobalRefresh(true);
      setLatestVideo(response);
    } catch (err) {
      toast.dismiss();
      toast.error("could not upload");
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
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVisualizationUrl(audioUrl);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast.error("please provide the permission to access your microphone");
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

  const stopRecordingAndCloseModal = () => {
    stopRecording();
    setShowModal(false);
  };

  return (
    <div id="homeDiv">
      <div className="d-flex flex-column align-items-center">
        <button
          onClick={isRecording ? stopRecordingAndCloseModal : startRecording}
          id="skoop_record_button"
          data-mdb-toggle="tooltip"
          data-mdb-placement="bottom"
          title="Record Audio"
        >
          {isRecording ? (
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
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.8943 24C22.1077 24 23.8943 22.2133 23.8943 20V12C23.8943 9.78667 22.1077 8 19.8943 8C17.681 8 15.8944 9.78667 15.8944 12V20C15.8944 22.2133 17.681 24 19.8943 24ZM27.7743 20C27.121 20 26.5744 20.48 26.4677 21.1333C25.921 24.2667 23.1877 26.6667 19.8944 26.6667C16.601 26.6667 13.8677 24.2667 13.321 21.1333C13.2144 20.48 12.6677 20 12.0144 20C11.201 20 10.561 20.72 10.681 21.52C11.3344 25.52 14.5344 28.6533 18.561 29.2267V32C18.561 32.7333 19.161 33.3333 19.8944 33.3333C20.6277 33.3333 21.2277 32.7333 21.2277 32V29.2267C25.2543 28.6533 28.4543 25.52 29.1077 21.52C29.241 20.72 28.5877 20 27.7743 20Z"
                fill="#2D68C4"
              />
            </svg>
          )}
        </button>
        <span className="record-button-bottom-text"> Record Audio</span>
      </div>
      <div>
        <div
          className="modal"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className=" modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body" style={{ maxHeight: "150px" }}>
                {isRecording && (
                  <canvas id="continuous" ref={continuousCanvasRef}></canvas>
                )}
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div>
                  {isRecording && <h6>Time Remaining: {60 - time} Sec</h6>}
                </div>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={stopRecordingAndCloseModal}
                >
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
