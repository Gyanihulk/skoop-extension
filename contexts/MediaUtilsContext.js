import React, { createContext, useEffect, useState } from 'react'
import API_ENDPOINTS from '../components/apiConfig'
import toast from 'react-hot-toast'
import { replaceInvalidCharacters } from '../utils'

const MediaUtilsContext = createContext()

export const MediaUtilsProvider = ({ children }) => {
  const getThumbnail = async (id) => {
    try {
      var response = await fetch(API_ENDPOINTS.getThumbnail + id, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      })
      response = await response.json()
      return response.url
    } catch (err) {
      console.error('error while fetching thumbnails', err)
      return null
    }
  }
  const getDownloadLink = async (id) => {
    try {
      var response = await fetch(API_ENDPOINTS.getVideoDownloadLink + '/' + id, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      })
      response = await response.json()
      return response.downloadLink
    } catch (err) {
      console.error('error while fetching thumbnails', err)
      return null
    }
  }
  const uploadVideo = async (file, videoTitle, directoryName, height, width) => {
    try {
      videoTitle = replaceInvalidCharacters(videoTitle + `_${Date.now()}`)
      const formData = new FormData()
      // check for the width and height
      let actualWidth = parseInt(width)
      let actualHeight = parseInt(height)

      if (width == height && width > 320) {
        actualWidth = 320
        actualHeight = 320
      } else if (width > height && width > 640) {
        actualWidth = 640
        actualHeight = 360
      } else if (height > width && height > 512) {
        actualWidth = 288
        actualHeight = 512
      }

      formData.append('data', file, `${videoTitle}.mp4`)
      formData.append('height', actualHeight)
      formData.append('width', actualWidth)
      formData.append('booking_link', actualWidth)
      const customHeaders = new Headers()
      customHeaders.append('title', videoTitle)
      customHeaders.append('directory_name', directoryName)
      customHeaders.append('type', 'mp4')

      customHeaders.append('authorization', `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`)

      const loadingObj = toast.loading('Uploading Video...')
      var response = await fetch(API_ENDPOINTS.vidyardUpload, {
        method: 'POST',
        headers: customHeaders,
        body: formData,
      })
      response = await response.json()
      toast.success('Video link Added to Custom Message', {
        id: loadingObj,
      })
      return response
    } catch (err) {
      console.error(err)
      toast.dismiss()
      toast.error('could not upload')
    }
  }

  const deleteVideo = async (id) => {
    const toastId = toast.loading('Deleting video')
    try {
      const response = await fetch(`${API_ENDPOINTS.deleteVideo}${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw Error
      }
      toast.success('Video deleted', {
        id: toastId,
      })
      return true
    } catch (err) {
      toast.error('Could not delete', {
        id: toastId,
      })
      return false
    }
  }

  const updateBookingLinkOfVideo = async (id, booking_link) => {
    const toastId = toast.loading('Updating booking link')
    try {
      const body = { booking_link }
      const response = await fetch(`${API_ENDPOINTS.updateVideoInfo}${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw Error
      }
      toast.success('Video Booking Link Updated', {
        id: toastId,
      })
      return true
    } catch (err) {
      toast.error('Could not update booking link', {
        id: toastId,
      })
      return false
    }
  }
  function startRecording(currentTabId) {
    // Prompt user to choose screen or window
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], function (streamId) {
      if (streamId == null) {
        return
      }

      // Once user has chosen screen or window, create a stream from it and start recording
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: streamId,
            },
          },
        })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream)

          chunks = []

          mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data)
          }

          mediaRecorder.onstop = async function (e) {
            const blobFile = new Blob(chunks, { type: 'video/webm' })
            const url = URL.createObjectURL(blobFile)
            // Stop all tracks of stream
            stream.getTracks().forEach((track) => track.stop())
            chrome.runtime.sendMessage({ action: 'recordingComplete', videoBlob: blobFile, url })
            // const downloadLink = document.createElement('a');
            // // Set the anchor's attributes
            // downloadLink.href = url;
            // downloadLink.download = 'demo.mp4'; // Specify the desired filename

            // // Programmatically trigger a click event on the anchor to initiate the download
            // downloadLink.click();
            // window.close()
          }

          mediaRecorder.start()
        })
        .finally(async () => {
          // After all setup, focus on previous tab (where the recording was requested)
          await chrome.tabs.update(currentTabId, { active: true, selected: true })
        })
    })
  }
  return (
    <MediaUtilsContext.Provider
      value={{
        getThumbnail,
        deleteVideo,
        uploadVideo,
        updateBookingLinkOfVideo,
        getDownloadLink,
        startRecording,
      }}
    >
      {children}
    </MediaUtilsContext.Provider>
  )
}

export default MediaUtilsContext
