import React, { useContext, useEffect, useState } from "react";
import API_ENDPOINTS from "./apiConfig";
import toast from "react-hot-toast";
import GlobalStatesContext from "../contexts/GlobalStates";
import Form from "react-bootstrap/Form";
import MediaUtilsContext from "../contexts/MediaUtilsContext";
import { handleCopyToClipboard } from "../utils";
import RenameVideoPopup from "./Library/RenameVideoPopup";
import { sendMessageToBackgroundScript } from "../lib/sendMessageToBackground";
import { FaPencilAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import MessageContext from "../contexts/MessageContext";

export const VideoPreview = () => {
  const [thumbnailImage, setThumbnailImage] = useState(
    "/images/videoProcessing.png"
  );
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [showVideoOptionsDialog, setShowVideoOptionsDialog] = useState(false);
  const [newTitle, setNewTitle] = useState();
  const [showBookingLink, setShowBookingLink] = useState(true);
  let { latestVideo, latestBlob, setLatestVideo, setLatestBlob } =
    useContext(GlobalStatesContext);
  const { deleteVideo, updateBookingLinkOfVideo } =
    useContext(MediaUtilsContext);
    const { message, setMessage } =
    useContext(MessageContext);

  useEffect(() => {

    if (latestVideo?.urlForThumbnail) {
      setThumbnailImage(latestVideo?.urlForThumbnail);
      setNewTitle(latestVideo?.name);
      setShowBookingLink(true);
    } else {
      setThumbnailImage("/images/videoProcessing.png");
    }
  }, [latestVideo]);
  useEffect(() => {
    console.log(latestBlob, "from video preview ");
  }, [latestBlob, thumbnailImage, , showRenamePopup, showVideoOptionsDialog]);
  const UpdateThumbnail = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImage(e.target.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("thumbnailImage", file);

      try {
        const res = await fetch(
          API_ENDPOINTS.updateThumbnailImage +
            "/" +
            latestVideo.facade_player_uuid,
          {
            method: "PATCH",
            body: formData,
            headers: {
              authorization: `Bearer ${JSON.parse(
                localStorage.getItem("accessToken")
              )}`,
            },
          }
        );
        if (res.ok) {
          const jsonResponse = await res.json();
          console.log(jsonResponse?.thumbnailUrl);
          setThumbnailImage(jsonResponse?.thumbnailUrl);

          toast.success("Thumbnail Image Updated", {
            className: "custom-toast",
          });
        } else throw new Error("Error in the database");
      } catch (err) {
        toast.error("Thumbnail Image Not Updated, Try Again", {
          className: "custom-toast",
        });
      }
    }
  };
  const openPopUp = (src, event) => {
    if (event) {
      event.stopPropagation();
    }
    const height = 322 * 1.5;
    const width = 574 * 1.5;

    sendMessageToBackgroundScript({
      action: "startPlayingVideo",
      height,
      width,
      src,
    });
  };

  const handleRenameSave = async () => {
    try {
      console.log(latestVideo?.name, newTitle, message);
      const response = await fetch(
        API_ENDPOINTS.renameVideo + `/${latestVideo?.id}`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem("accessToken")
            )}`,
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            newTitle: newTitle,
          }),
        }
      );
  
      if (response.ok) {
        toast.success("Video renamed successfully", {
          className: "custom-toast",
        });
        setShowRenamePopup(!showRenamePopup);
  
        // Check if the video title has changed
        if (latestVideo?.name !== newTitle) {
          // Update the message with the new video title
          const updatedMessage = message.replace(
            /Watch Video - .*?<\/a>/,
            `Watch Video - ${newTitle}</a>`
          );
          latestVideo.name=newTitle
          setMessage(updatedMessage);
        }
      } else {
        toast.error("Failed to rename video.", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      toast.error("Failed to rename video.", {
        className: "custom-toast",
      });
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteVideo(latestVideo.id);
      setLatestVideo();
      setLatestBlob();
    } catch (error) {
      toast.error("Failed to delete video", {
        className: "custom-toast",
      });
    }
  };

  const handleDownload = React.useCallback(() => {
    if (latestBlob) {
      const urlToDownload =
        latestBlob instanceof Blob
          ? window.URL.createObjectURL(latestBlob)
          : latestBlob;

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = urlToDownload;
      a.target = "_blank";
      a.download = "Skoop video.mp4";
      a.click();

      document.body.removeChild(a);

      if (urlToDownload !== latestBlob) {
        window.URL.revokeObjectURL(urlToDownload);
      }
    }
  }, [latestBlob]);

  const handleIconClick = (eventKey) => {
    console.log(eventKey);
    if (eventKey == "Copy Link") {
      handleCopyToClipboard(
        "https://skoop.hubs.vidyard.com/watch/" +
          latestVideo?.facade_player_uuid
      );
    }
    if (eventKey == "Download") {
      handleDownload();
    }
    if (eventKey == "Update Thumbnail") {
      document.getElementById("file-upload").click();
    }
    if (eventKey == "Delete") {
      handleDeleteClick();
      setLatestVideo();
    }
    if (eventKey == "Rename Title") {
      setShowRenamePopup(!showRenamePopup);
    }
    setShowVideoOptionsDialog(!showVideoOptionsDialog);
  };

  if (!latestBlob && !latestVideo) {
    return <></>;
  }
  const handleSwitchChange = async (e) => {
    console.log(e.target.checked);
    setShowBookingLink(e.target.checked);
    await updateBookingLinkOfVideo(
      latestVideo.facade_player_uuid,
      e.target.checked
    );
  };
  return (
    <>
      {showRenamePopup && (
        <RenameVideoPopup
          newTitle={newTitle}
          onClose={() => {
            setShowRenamePopup(!showRenamePopup);
          }}
          onSave={handleRenameSave}
          onTitleChange={(e) => setNewTitle(e.target.value)}
        />
      )}
      <input
        id="file-upload"
        type="file"
        style={{ display: "none" }}
        onChange={UpdateThumbnail}
        accept="image/*"
      />

      <div className="container" id="video-Preview">
        <div className="card d-flex flex-row align-items-center">
          <div
            className="d-flex justify-content-between px-2"
            id="video-preview-top-content"
          >
            <div>
              {newTitle != null ? (
                <div>
                  <span id="preview-video-name">
                    {newTitle?.length > 5
                      ? `${newTitle?.slice(0, 6)}...${newTitle?.slice(-4)}`
                      : " "}
                  </span>

                  <FaPencilAlt
                    className="video-preview-icon"
                    size={12}
                    onClick={() => handleIconClick("Rename Title")}
                    title="Edit Title"
                  />
                </div>
              ) : null}
            </div>
            <div className="d-flex align-items-center">
              <div id="booking-switch">
                <Form title="Show Booking Link">
                  <Form.Check
                    type="switch"
                    checked={showBookingLink}
                    onChange={handleSwitchChange}
                    className="small-switch video-preview-icon"
                    id="video-container-switch"
                  />
                </Form>
              </div>
              <BsThreeDotsVertical
                title="Menu"
                className="video-preview-icon"
                size={12}
                onClick={() =>
                  setShowVideoOptionsDialog(!showVideoOptionsDialog)
                }
                color="white"
              />
            </div>
          </div>
          <img
            className="video-preview-iframe-img"
            src={thumbnailImage}
            alt="Video Thumbnail"
            onClick={(e) => {
              openPopUp(
                `https://play.vidyard.com/${latestVideo?.facade_player_uuid}.html?`,
                e
              );
            }}
          />

          <div id="video-preview-option">
            <div
              className={`ddstyle dropdown-menu ${
                showVideoOptionsDialog ? "show" : ""
              }`}
            >
              {[
                "Rename Title",
                "Update Thumbnail",
                "Copy Link",
                "Download",
                "Delete",
              ].map((key, index) => (
                <button
                  onClick={() => handleIconClick(key)}
                  className="dropdown-item"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
