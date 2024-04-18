import React, { createContext, useEffect, useState } from "react";
import API_ENDPOINTS from "../components/apiConfig";
import toast from "react-hot-toast";
import { replaceInvalidCharacters } from "../utils";

const MediaUtilsContext = createContext();

export const MediaUtilsProvider = ({ children }) => {
  const getThumbnail = async (id) => {
    try {
      var response = await fetch(API_ENDPOINTS.getThumbnail + id, {
        method: "GET",
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      response = await response.json();
      return response.url;
    } catch (err) {
      console.log("error while fetching thumbnails", err);
      return null;
    }
  };

  const uploadVideo = async (
    file,
    videoTitle,
    directoryName,
    height,
    width
  ) => {
    try {
      videoTitle = replaceInvalidCharacters(videoTitle + `_${Date.now()}`);
      const formData = new FormData();
      formData.append("data", file, `${videoTitle}.mp4`);
      formData.append("height", parseInt(height));
      formData.append("width", parseInt(width));
      formData.append("booking_link", parseInt(width));
      const customHeaders = new Headers();
      customHeaders.append("title", videoTitle);
      customHeaders.append("directory_name", directoryName);
      customHeaders.append("type", "mp4");

      customHeaders.append(
        "authorization",
        `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`
      );

      const loadingObj = toast.loading("Uploading Video...");
      var response = await fetch(API_ENDPOINTS.vidyardUpload, {
        method: "POST",
        headers: customHeaders,
        body: formData,
      });
      response = await response.json();
      toast.success("Video link Added to Custom Message", {
        id: loadingObj,
      });
      return response;
    } catch (err) {
      console.log(err);
      toast.dismiss();
      toast.error("could not upload");
    }
  };

  const deleteVideo = async (id) => {
    const toastId = toast.loading("Deleting video");
    try {
      const response = await fetch(`${API_ENDPOINTS.deleteVideo}${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw Error;
      }
      toast.success("Video deleted", {
        id: toastId,
      });
      return true;
    } catch (err) {
      toast.error("Could not delete", {
        id: toastId,
      });
      return false;
    }
  };

  const updateBookingLinkOfVideo = async (id, booking_link) => {
    const toastId = toast.loading("Updating booking link");
    try {
      const body = { booking_link };
      console.log(body);
      const response = await fetch(`${API_ENDPOINTS.updateVideoInfo}${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (!response.ok) {
        throw Error;
      }
      toast.success("Video Booking Link Updated", {
        id: toastId,
      });
      return true;
    } catch (err) {
      toast.error("Could not update booking link", {
        id: toastId,
      });
      return false;
    }
  };

  return (
    <MediaUtilsContext.Provider
      value={{
        getThumbnail,
        deleteVideo,
        uploadVideo,
        updateBookingLinkOfVideo,
      }}
    >
      {children}
    </MediaUtilsContext.Provider>
  );
};

export default MediaUtilsContext;
