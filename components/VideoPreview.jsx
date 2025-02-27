import React, { useContext, useEffect, useState } from 'react'
import API_ENDPOINTS from './apiConfig'
import toast from 'react-hot-toast'
import GlobalStatesContext from '../contexts/GlobalStates'
import Form from 'react-bootstrap/Form'
import MediaUtilsContext from '../contexts/MediaUtilsContext'
import { handleCopyToClipboard } from '../utils'
import RenameVideoPopup from './Library/RenameVideoPopup'
import { sendMessageToBackgroundScript } from '../lib/sendMessageToBackground'
import { FaPencilAlt } from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'
import MessageContext from '../contexts/MessageContext'
import DeleteModal from './DeleteModal'
import ScreenContext from '../contexts/ScreenContext'
import TourContext from '../contexts/TourContext.js'
import AuthContext from '../contexts/AuthContext.js'

export const VideoPreview = () => {
  const [thumbnailImage, setThumbnailImage] = useState('/images/videoProcessing.png')
  const [showRenamePopup, setShowRenamePopup] = useState(false)
  const [showVideoOptionsDialog, setShowVideoOptionsDialog] = useState(false)
  const [newTitle, setNewTitle] = useState()
  const [showBookingLink, setShowBookingLink] = useState(true)
  let { latestVideo, latestBlob, setLatestVideo, setLatestBlob } = useContext(GlobalStatesContext)
  const { deleteVideo, updateBookingLinkOfVideo } = useContext(MediaUtilsContext)
  const { message, setMessage } = useContext(MessageContext)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const { activePage } = useContext(ScreenContext)
  const { getDownloadLink, getThumbnail } = useContext(MediaUtilsContext)
  const { ctaStatus } = useContext(AuthContext)
  
  const { componentsVisible, isVideoTour, activeTourStepIndex, initializeTour, startTour, setStepIndex } = useContext(TourContext)
  useEffect(() => {
    if (latestVideo?.urlForThumbnail) {
      setThumbnailImage(latestVideo?.urlForThumbnail)
      setNewTitle(latestVideo?.name)
      setShowBookingLink(true)
    } else {
      setThumbnailImage('/images/videoProcessing.png')
    }
  }, [latestVideo])

  useEffect(() => {
    let timer

    if (isVideoTour && latestVideo) {
      if (activeTourStepIndex === 13) {
        initializeTour()

        startTour('videos')
        timer = setTimeout(() => {
          setStepIndex(13)
        }, 300)
      }
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [latestVideo])

  useEffect(() => {}, [latestBlob, thumbnailImage, , showRenamePopup, showVideoOptionsDialog])
  const UpdateThumbnail = async (event) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailImage(e.target.result)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append('thumbnailImage', file)

      try {
        const res = await fetch(API_ENDPOINTS.updateThumbnailImage + '/' + latestVideo.facade_player_uuid, {
          method: 'PATCH',
          body: formData,
          headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          },
        })
        if (res.ok) {
          const jsonResponse = await res.json()
          setThumbnailImage(jsonResponse?.thumbnailUrl)

          toast.success('Thumbnail Image Updated')
        } else throw new Error('Error in the database')
      } catch (err) {
        toast.error('Thumbnail Image Not Updated, Try Again')
      }
    }
  }
  const openPopUp = (src, event) => {
    if (event) {
      event.stopPropagation()
    }
    const height = 322 * 1.5
    const width = 574 * 1.5

    sendMessageToBackgroundScript({
      action: 'startPlayingVideo',
      height,
      width,
      src,
    })
  }

  const handleRenameSave = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.renameVideo + `/${latestVideo?.id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          newTitle: newTitle,
        }),
      })

      if (response.ok) {
        toast.success('Video renamed successfully')
        setShowRenamePopup(!showRenamePopup)

        // Check if the video title has changed
        if (latestVideo?.name !== newTitle) {
          // Update the message with the new video title
          const updatedMessage = message.replace(/(Watch Video - )[^<]*/, `$1${newTitle}`)
          latestVideo.name = newTitle
          setMessage(updatedMessage)
        }
      } else {
        toast.error('Failed to rename video.')
      }
    } catch (error) {
      toast.error('Failed to rename video.')
    }
  }

  const handleDeleteClick = async () => {
    try {
      await deleteVideo(latestVideo.id)
      setLatestVideo()
      setLatestBlob({})
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const handleDownload = async () => {
    await getDownloadLink(latestVideo.facade_player_uuid)
  }
  const onDeleteVideo = () => {
    handleDeleteClick()
  }

  const handleIconClick = (eventKey) => {
    if (eventKey == 'Copy Link') {
      handleCopyToClipboard('https://skoop.hubs.vidyard.com/watch/' + latestVideo?.facade_player_uuid)
    }
    if (eventKey == 'Download') {
      handleDownload()
    }
    if (eventKey == 'Update Thumbnail') {
      document.getElementById('file-upload').click()
    }
    if (eventKey == 'Delete') {
      setIsDeleteModal(true)
    }
    if (eventKey == 'Rename Title') {
      setShowRenamePopup(!showRenamePopup)
    }
    setShowVideoOptionsDialog(!showVideoOptionsDialog)
  }

  if (!latestBlob && !latestVideo) {
    return <></>
  }
  const handleSwitchChange = async (e) => {
    setShowBookingLink(e.target.checked)
    await updateBookingLinkOfVideo(latestVideo.facade_player_uuid, e.target.checked)
  }

  return (
    <>
      {showRenamePopup && (
        <RenameVideoPopup
          newTitle={newTitle}
          onClose={() => {
            setShowRenamePopup(!showRenamePopup)
          }}
          onSave={handleRenameSave}
          onTitleChange={(e) => setNewTitle(e.target.value)}
        />
      )}
      <input id="file-upload" type="file" style={{ display: 'none' }} onChange={UpdateThumbnail} accept="image/*" />

      {latestVideo && latestBlob instanceof Blob && latestBlob && (
        <div className="container" id="video-Preview">
          <div className="card d-flex flex-row align-items-center">
            <div className="d-flex justify-content-between px-2" id="video-preview-top-content">
              <div>
                {newTitle != null ? (
                  <div>
                    <span id="preview-video-name">{newTitle?.length > 5 ? `${newTitle?.slice(0, 6)}...${newTitle?.slice(-4)}` : ' '}</span>

                    <FaPencilAlt className="video-preview-icon" size={12} onClick={() => handleIconClick('Rename Title')} title="Edit Title" />
                  </div>
                ) : null}
              </div>
              <div className="d-flex align-items-center">
                <div id="booking-switch">
                  <Form title={!ctaStatus? "Please switch on CTA Link from Account Settings":"Show Booking Link"}>
                    <Form.Check disabled={!ctaStatus} type="switch" checked={!ctaStatus ?false:showBookingLink} onChange={handleSwitchChange} className="small-switch video-preview-icon" id="video-container-switch" />
                  </Form>
                </div>
                <BsThreeDotsVertical id="video-menu" title="Menu" className="video-preview-icon" size={12} onClick={() => setShowVideoOptionsDialog(!showVideoOptionsDialog)} color="white" />
              </div>
            </div>
            <img
              className="video-preview-iframe-img"
              src={thumbnailImage}
              alt="Video Thumbnail"
              onClick={(e) => {
                openPopUp(`https://play.vidyard.com/${latestVideo?.facade_player_uuid}.html?`, e)
              }}
            />

            <div id="video-preview-option">
              <div className={`ddstyle dropdown-menu ${showVideoOptionsDialog ? 'show' : ''}`}>
                {['Rename Title', 'Update Thumbnail', 'Copy Link', 'Download', 'Delete'].map((key, index) => (
                  <button onClick={() => handleIconClick(key)} className="dropdown-item">
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal middleContent={newTitle} show={isDeleteModal} onHide={() => setIsDeleteModal(false)} onDelete={() => onDeleteVideo()} />
    </>
  )
}
