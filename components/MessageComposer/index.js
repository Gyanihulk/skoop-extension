import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { AiFillRobot } from 'react-icons/ai'
import { HiMiniGif } from 'react-icons/hi2'
import EmojiPicker from 'emoji-picker-react'
import ChatGpt from '../Chatgpt/index.js'
import GiphyWindow from '../Gif/index.js'
import MessageTemplate from '../TemplateMessage/index.js'
import { handleCopyToClipboard, insertHtmlAtPositionInMail, insertIntoLinkedInMessageWindow } from '../../utils/index.js'
import GlobalStatesContext from '../../contexts/GlobalStates.js'
import MessageWindow from '../MessageWindow.jsx'
import MessageContext from '../../contexts/MessageContext.js'
import AuthContext from '../../contexts/AuthContext.js'
import ChatWindowSelection from '../ChatWindowSelection/index.js'
import toast from 'react-hot-toast'
import API_ENDPOINTS from '../apiConfig.js'
import MediaUtilsContext from '../../contexts/MediaUtilsContext.js'
import { VideoPreview } from '../VideoPreview.jsx'
import ScreenContext from '../../contexts/ScreenContext.js'
import { MdOutlineFileUpload } from 'react-icons/md'
import { useRecording } from '../../contexts/RecordingContext.js'
import { FaRegClipboard } from 'react-icons/fa'
import { TbCut } from "react-icons/tb";
import { MdCallToAction } from 'react-icons/md'
import TourContext from '../../contexts/TourContext.js'
const MessageComposer = () => {
  const [displayComp, setDisplayComp] = useState('')
  const [activateCalenderLink, setActivateCalenderLink] = useState(false)
  const [flashTrigger, setFlashTrigger] = useState(0)
  const { isGmail, isLinkedin, selectedChatWindows, focusedElementId, isProfilePage, isVideoContainer, setIsVideoContainer, expand, setLatestBlob, setLatestVideo, latestBlob, postCommentSelected, postCommentElement, isMatchingUrl } =
    useContext(GlobalStatesContext)
  const { message, addMessage, setMessage } = useContext(MessageContext)
  const { getCalendarUrl, getUserPreferences, getProfileDetails, userProfileDetail, ctaStatus } = useContext(AuthContext)
  const { uploadVideo } = useContext(MediaUtilsContext)
  const { addToMessage } = useContext(MessageContext)
  const { navigateToPage, activePage } = useContext(ScreenContext)
  const { isRecordStart } = useRecording()
  const { messageRef, isToorActive, isVideoTour, isMessageSended, setIsMessageSended, setSendMessages, isMessageTour, activeTourStep, activeTourStepIndex, componentsVisible, renderNext, activeTourName, sendMessages } = useContext(TourContext)

  const handleInsertion = (text) => {
    const newText = text + ' \n '
    addMessage(newText)
    window.scrollTo(0, document.body.scrollHeight)
  }

  useEffect(() => {
    if (isMessageTour) {
      if ([0, 1].includes(componentsVisible?.renderItem)) {
        setDisplayComp('Message')
        renderNext()
      }
    }

    if (isVideoTour && [5, 6].includes(componentsVisible?.renderItem)) {
      setDisplayComp('Message')
      renderNext()
    }
  }, [componentsVisible])

  useEffect(() => {
    if (latestBlob && Object.keys(latestBlob).length > 0) {
      setDisplayComp('DefaultCard')
    }
  }, [message, latestBlob])
  const addMeetSchedulingLink = async () => {
    const url = await getCalendarUrl()
    if (isGmail) {
      handleInsertion(`<a href="${url}">Schedule Virtual Appointment</a>`)
    } else {
      handleInsertion(url)
    }
    toast.success('Meeting Calendar link added successfully!', {
      className: 'custom-toast',
    })
  }

  const checkForUserPreferences = async () => {
    const userPreferences = await getUserPreferences()
    const url = await getCalendarUrl()
    let user = userProfileDetail
    if (!user) {
      user = await getProfileDetails()
    }

    if (url.startsWith(API_ENDPOINTS.skoopCalendarUrl)) {
      if (userPreferences && userPreferences.length > 0) {
        if (user && user?.calendar_info) {
          return true
        } else {
          toast.error('Please sync your calendar from account settings page.')
          return false
        }
      } else {
        toast.error('User preference is not set')
        return false
      }
    } else {
      return true
    }
  }

  const handleIconClick = async (eventKey) => {
    setLatestBlob({})
    setLatestVideo()
    if (isMessageTour && [0, 6].includes(activeTourStepIndex)) {
      renderNext()
    } else if (isVideoTour && activeTourStepIndex === 5) {
      renderNext()
    }

    if (eventKey === 'CTA-Link') {
      if ((await checkForUserPreferences()) && ctaStatus) {
        setDisplayComp(eventKey)
        addMeetSchedulingLink()
        return
      }
    }
    if (eventKey === 'Upload Video') {
      toast.success('Video size should not be more than 50 mb.')

      // Set a timeout before opening the file upload dialog
      setTimeout(() => {
        document.getElementById('video-upload').click()
      }, 1000)
    }
    if (eventKey === 'Videos') {
      setIsVideoContainer(true)
    }
    if (displayComp == eventKey) {
      setDisplayComp('DefaultCard')
    } else {
      setDisplayComp(eventKey)
    }
  }

  const renderNavItem = (eventKey, icon, tooltipText) => {
    return (
      <li key={eventKey} className="cursor-pointer">
        <a className={`px-1 ${displayComp === eventKey ? 'text-black' : 'text-white'}`} onClick={() => handleIconClick(eventKey)} data-bs-toggle="tooltip" data-bs-placement="bottom" title={tooltipText}>
          {React.cloneElement(icon, { size: 20 })}
          <span className="d-none d-sm-inline">{tooltipText}</span>
        </a>
      </li>
    )
  }

  const handleSend = () => {
    const clickSendButtons = (arr) => {
      const sendButtons = Array.from(document.getElementsByClassName('msg-form__send-button'))
      arr.forEach((item) => {
        const btn = sendButtons[item.index]
        btn.click()
      })
    }

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const targetTab = tabs[0]
        if (targetTab) {
          try {
            chrome.scripting.executeScript({
              target: { tabId: targetTab.id },
              func: clickSendButtons,
              args: [selectedChatWindows],
            })
          } catch (err) {
            console.error('some error occured in executing script', err)
          }
        }
      })
    } catch (err) {
      console.error('some error occured while setting up initial array')
    }
  }
  function hasDatasetProperty(item) {
    return item.hasOwnProperty('dataset')
  }

  const handleOpenMessageWindow = () => {
    const clickMessageButton = () => {
      const btns = Array.from(document.querySelectorAll('div>div>div>button'))
      let selectedButton = btns.find((btn) => btn.ariaLabel && btn.ariaLabel.includes('Message'))
      if (selectedButton) {
        selectedButton.click()
      } else {
        throw new Error('Message button not found.')
      }
    }

    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const targetTab = tabs[0]
          if (targetTab) {
            chrome.scripting.executeScript(
              {
                target: { tabId: targetTab.id },
                func: clickMessageButton,
              },
              (injectionResults) => {
                if (chrome.runtime.lastError) {
                  console.error('Error executing script:', chrome.runtime.lastError)
                  reject('Failed to execute script on tab')
                } else {
                  resolve('Message button clicked successfully')
                }
              }
            )
          } else {
            reject('Target tab is not accessible')
          }
        })
      } catch (err) {
        console.error('some error occurred while trying to open message window', err)
        reject('Unexpected error occurred')
      }
    })
  }

  const handleInsertionToWebsite = async () => {
    if (message === null || message === undefined) {
      toast.error('Please add message!!')
      return
    }
    if ((isMessageTour && activeTourStep?.level === 13) || (isVideoTour && activeTourStep?.level === 16)) {
      setSendMessages(true)
      setIsMessageSended(true)
      renderNext()
    }

    if (isLinkedin) {
      if (!postCommentSelected && selectedChatWindows?.length === 0) {
        toast.error('Please select a recipient')
        return
      }

      for (const item of selectedChatWindows) {
        if (hasDatasetProperty(item)) {
          try {
            const openChatWindow = await handleOpenMessageWindow()
          } catch (err) {
            console.error(err)
          }
        }
      }
      await insertIntoLinkedInMessageWindow(`<p>${message}</p>`, selectedChatWindows, postCommentSelected, postCommentElement)
      setTimeout(() => {
        handleSend()
      }, 900)
      toast.success('Message Sent Successfully!!')
      if (postCommentSelected) {
        let toastId = toast.loading('Message Sent Successfully!!')

        // Countdown duration in seconds
        let countdown = 7

        // Update the toast every second
        const interval = setInterval(() => {
          countdown -= 1
          if (countdown > 0) {
            // Update the toast with the remaining countdown time
            toast.loading(`Comment will be posted in ${countdown} seconds...`, {
              id: toastId,
            })
          } else {
            // Clear the interval when countdown is finished
            clearInterval(interval)
            // Update the toast with the final message
            toast.success('Comment posted!', {
              id: toastId,
              duration: 7000,
            })
          }
        }, 1000)
      }
    } else {
      const gmailInsertion = await insertHtmlAtPositionInMail(message, focusedElementId)
      if (gmailInsertion) {
        setMessage()
      }
    }
    if (selectedChatWindows?.length !== 0 || postCommentSelected) {
      setMessage()
    }
  }
  const saveMessageAsTemplate = async () => {
    const heading = new Date().toISOString()
    try {
      const response = await fetch(API_ENDPOINTS.skoopCrmAddPreloadedResponses, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`,
        },
        body: JSON.stringify({
          heading: 'Saved message' + heading,
          description: message,
        }),
      })

      if (response.ok) {
        toast.success('Message saved to template successfully')
      } else {
        toast.error('Failed to add as template message. Please try again.')
      }
    } catch (error) {
      console.error('Error to add as template message:', error)
      toast.error('Failed to add as template message. Please try again.')
    }
  }
  const renderNavButtonItem = (eventKey, icon, tooltipText, itemReference = null, disabled = false, disableText = false) => (
    <div class={disabled && 'tooltip-wrapper'} data-bs-toggle="tooltip" data-bs-placement="bottom" title={disableText}>
      <li disabled={disabled} id={eventKey} key={eventKey} className={`rounded-1 p-1 ${displayComp === eventKey ? 'bg-active active' : ''} ${disabled ? 'disabled-class' : ''}`}>
        <a disaref={itemReference} className={`text-decoration-none ${displayComp === eventKey ? 'text-white' : 'text-black'}`} onClick={() => handleIconClick(eventKey)} data-bs-toggle="tooltip" data-bs-placement="bottom" title={tooltipText}>
          <div className="d-flex flex-column align-items-center justify-content-center">
            {React.cloneElement(icon, {
              className: `svg-icon ${displayComp === eventKey ? 'active-path' : 'default-path'}`,
            })}
            <span className="nav-item-label">{eventKey}</span>
          </div>
        </a>
      </li>
    </div>
  )
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  const uploadVideoHandler = async (event) => {
    const file = event.target.files[0]
    event.target.value = null

    if (file) {
      let fileSizeInMB = file.size / (1024 * 1024)
      fileSizeInMB = fileSizeInMB.toFixed(2)

      if (fileSizeInMB > 80) {
        toast.error('Video size should not be more than 50 mb.')
        // return
      }
      const videoTitle = 'MyVideoTitle'
      const directoryName = 'New'

      // Create a URL for the uploaded video file
      const videoUrl = URL.createObjectURL(file)
      const videoElement = document.createElement('video')

      // Set the video source to the created URL
      videoElement.src = videoUrl

      // Load the video metadata to ensure dimensions are available
      videoElement.addEventListener('loadedmetadata', async function () {
        // Now you have access to video dimensions
        const width = videoElement.videoWidth
        const height = videoElement.videoHeight

        // Proceed with your upload function, now including dimensions
        try {
          const response = await uploadVideo(file, videoTitle, directoryName, height, width)
          setLatestVideo(response)
          addToMessage(response.facade_player_uuid, response?.urlForThumbnail)
        } catch (error) {
          console.error('Upload Error:', error)
        }

        // Cleanup: Revoke the object URL to free up resources
        URL.revokeObjectURL(videoUrl)
      })

      // Load the video to trigger 'loadedmetadata'
      videoElement.load()
    }
  }
  const onEmojiClick = (event) => {
    addMessage('' + event.emoji)
  }


  function handleCopy() {
    handleCopyToClipboard(message)
    toast.success('Message copied.')
    setFlashTrigger((prevCount) => prevCount + 1)
    if ((isMessageTour && activeTourStep?.level === 13) || (isVideoTour && activeTourStep?.level === 16)) {
      renderNext()
    }
  }
  function handleCut() {
    handleCopyToClipboard(message)
    toast.success('Message cut.')
    setFlashTrigger((prevCount) => prevCount + 1)
    setMessage()
    if ((isMessageTour && activeTourStep?.level === 13) || (isVideoTour && activeTourStep?.level === 16)) {
      renderNext()
    }

  }
  useEffect(() => {
    if (isToorActive && sendMessages && !isMessageSended) {
      if (isMatchingUrl) {
        handleInsertionToWebsite()
      } else {
        handleCopy()
      }
    }
  }, [sendMessages])

  return (
    <>
      <input id="video-upload" type="file" style={{ display: 'none' }} onChange={uploadVideoHandler} accept="video/*" />
      {!isVideoContainer ? (
        <nav className="nav-btn">
          <div class="container mt-1 mx-2">
            <ul className="nav-button mb-1">
              {renderNavButtonItem(
                'Message',
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.3 0.5H1.7C1.04 0.5 0.506 1.04 0.506 1.7L0.5 12.5L2.9 10.1H11.3C11.96 10.1 12.5 9.56 12.5 8.9V1.7C12.5 1.04 11.96 0.5 11.3 0.5ZM9.5 7.7H3.5C3.17 7.7 2.9 7.43 2.9 7.1C2.9 6.77 3.17 6.5 3.5 6.5H9.5C9.83 6.5 10.1 6.77 10.1 7.1C10.1 7.43 9.83 7.7 9.5 7.7ZM9.5 5.90007H3.5C3.17 5.90007 2.9 5.63007 2.9 5.30007C2.9 4.97007 3.17 4.70007 3.5 4.70007H9.5C9.83 4.70007 10.1 4.97007 10.1 5.30007C10.1 5.63007 9.83 5.90007 9.5 5.90007ZM9.5 4.10015H3.5C3.17 4.10015 2.9 3.83015 2.9 3.50015C2.9 3.17015 3.17 2.90015 3.5 2.90015H9.5C9.83 2.90015 10.1 3.17015 10.1 3.50015C10.1 3.83015 9.83 4.10015 9.5 4.10015Z"
                    fill="#2A2B39"
                  />
                </svg>,
                'Send predetermined custom message responses.',
                messageRef
              )}
              {renderNavButtonItem(
                'ChatGpt',
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_244_1015)">
                    <path
                      d="M9.89161 0H2.77538C1.42676 0 0.333496 1.10224 0.333496 2.46192V9.53808C0.333496 10.8978 1.42676 12 2.77538 12H9.89161C11.2402 12 12.3335 10.8978 12.3335 9.53808V2.46192C12.3335 1.10224 11.2402 0 9.89161 0Z"
                      fill="#2A2B39"
                    />
                    <path
                      d="M9.20877 5.39084C9.26547 5.22047 9.29438 5.04209 9.29441 4.86254C9.29439 4.56543 9.21525 4.27368 9.06512 4.01729C8.76346 3.49219 8.20387 3.16801 7.59824 3.16801C7.47893 3.16801 7.35995 3.18061 7.24328 3.2056C7.08636 3.0288 6.89374 2.88728 6.67813 2.79035C6.46252 2.69343 6.22882 2.64332 5.99242 2.64331H5.9818L5.97782 2.64333C5.2443 2.64333 4.59379 3.11665 4.3683 3.81444C4.13488 3.86224 3.91437 3.95936 3.72153 4.09929C3.52869 4.23921 3.36797 4.41872 3.25012 4.6258C3.10045 4.88373 3.02158 5.17663 3.02148 5.47484C3.02154 5.89395 3.17711 6.29812 3.45808 6.6091C3.40136 6.77946 3.37244 6.95785 3.37241 7.1374C3.37244 7.43451 3.45158 7.72626 3.6017 7.98265C3.78022 8.29348 4.05285 8.53958 4.38027 8.68545C4.70768 8.83133 5.07297 8.86945 5.42345 8.79432C5.58039 8.97112 5.77303 9.11264 5.98865 9.20957C6.20428 9.3065 6.438 9.35662 6.67441 9.35663H6.68502L6.68934 9.35661C7.42326 9.35661 8.07355 8.88326 8.29905 8.18485C8.53246 8.13703 8.75297 8.0399 8.94581 7.89997C9.13865 7.76004 9.29939 7.58053 9.41725 7.37347C9.56676 7.11576 9.64548 6.82311 9.64544 6.52517C9.64538 6.10607 9.48981 5.70191 9.20884 5.39094L9.20877 5.39084ZM6.68545 8.91774H6.68371C6.39004 8.91764 6.10569 8.81462 5.88011 8.62658C5.8935 8.61936 5.90674 8.61186 5.91981 8.60408L7.2565 7.83197C7.28986 7.81299 7.31759 7.78551 7.33689 7.75233C7.35619 7.71915 7.36636 7.68145 7.36638 7.64307V5.75731L7.93136 6.08354C7.93433 6.08502 7.93688 6.0872 7.9388 6.08991C7.94071 6.09261 7.94194 6.09574 7.94235 6.09903V7.65964C7.94158 8.35348 7.37934 8.91633 6.68545 8.91774ZM3.98242 7.76328C3.87201 7.57237 3.81384 7.35574 3.81377 7.1352C3.81377 7.06327 3.82005 6.99115 3.83228 6.92028C3.84222 6.92623 3.85956 6.93683 3.87201 6.94398L5.2087 7.71608C5.24202 7.73553 5.27992 7.74578 5.31851 7.74577C5.35709 7.74576 5.39499 7.7355 5.4283 7.71603L7.06026 6.77373V7.4262L7.06028 7.42733C7.06028 7.43047 7.05955 7.43357 7.05815 7.43638C7.05675 7.43919 7.05471 7.44163 7.0522 7.44352L5.70093 8.22371C5.50973 8.33375 5.29301 8.39169 5.07241 8.39176C4.85157 8.39172 4.63462 8.33364 4.44332 8.22332C4.25201 8.113 4.09307 7.95433 3.98242 7.76321V7.76328ZM3.63077 4.84517C3.77758 4.59017 4.00939 4.39492 4.28563 4.29359C4.28563 4.3051 4.28498 4.32549 4.28498 4.33965V5.88387L4.28495 5.88514C4.28496 5.92348 4.29511 5.96114 4.31438 5.99429C4.33365 6.02744 4.36135 6.0549 4.39466 6.07388L6.02662 7.01605L5.46166 7.34227C5.45887 7.34411 5.45567 7.34523 5.45235 7.34553C5.44902 7.34583 5.44567 7.34531 5.4426 7.34401L4.0912 6.56316C3.90015 6.45249 3.74155 6.29355 3.63129 6.10228C3.52103 5.911 3.46298 5.6941 3.46295 5.47332C3.46304 5.25288 3.52092 5.03632 3.63084 4.84524L3.63077 4.84517ZM8.27268 5.92538L6.64073 4.9831L7.20571 4.65699C7.2085 4.65515 7.2117 4.65403 7.21502 4.65373C7.21835 4.65342 7.22169 4.65395 7.22477 4.65526L8.57615 5.43544C8.76735 5.54594 8.92611 5.70479 9.03651 5.89605C9.14691 6.08731 9.20505 6.30424 9.20509 6.52508C9.20509 7.05216 8.8762 7.5238 8.38166 7.70583V6.11544C8.38173 6.11485 8.38173 6.11424 8.38173 6.11365C8.38172 6.07545 8.37164 6.03793 8.35249 6.00487C8.33334 5.97182 8.30581 5.9444 8.27268 5.92538ZM8.83502 5.07903C8.82188 5.07098 8.80864 5.06309 8.79531 5.05536L7.45862 4.28323C7.4253 4.26381 7.38742 4.25357 7.34884 4.25356C7.31027 4.25357 7.27239 4.26381 7.23906 4.28323L5.60709 5.22554V4.57306L5.60706 4.57194C5.60706 4.56556 5.61009 4.55956 5.61517 4.55574L6.96644 3.77621C7.15757 3.66602 7.37431 3.60801 7.59494 3.608C8.28972 3.608 8.85316 4.17144 8.85316 4.86622C8.85312 4.93752 8.84705 5.00868 8.83502 5.07896V5.07903ZM5.29991 6.24195L4.73481 5.91572C4.73185 5.91425 4.72929 5.91206 4.72737 5.90936C4.72546 5.90665 4.72424 5.90352 4.72382 5.90023V4.3396C4.72413 3.64519 5.28756 3.08222 5.98204 3.08222C6.27617 3.08229 6.561 3.18532 6.78709 3.37346C6.77692 3.37901 6.75918 3.38881 6.74739 3.39596L5.4107 4.16806C5.37735 4.18704 5.34962 4.2145 5.33032 4.24767C5.31103 4.28084 5.30086 4.31852 5.30085 4.3569V4.35814L5.29991 6.24195ZM5.60683 5.58024L6.33367 5.16043L7.06052 5.57996V6.4193L6.33367 6.83886L5.60683 6.4193V5.58024Z"
                      fill="#FBF7FF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_244_1015">
                      <rect width="12" height="12" fill="white" transform="translate(0.333496)" />
                    </clipPath>
                  </defs>
                </svg>,
                'Send Chatgpt responses'
              )}

              {renderNavButtonItem(
                'Videos',
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.766504 2.9C0.436504 2.9 0.166504 3.17 0.166504 3.5V11.3C0.166504 11.96 0.706504 12.5 1.3665 12.5H9.1665C9.4965 12.5 9.7665 12.23 9.7665 11.9C9.7665 11.57 9.4965 11.3 9.1665 11.3H1.9665C1.6365 11.3 1.3665 11.03 1.3665 10.7V3.5C1.3665 3.17 1.0965 2.9 0.766504 2.9ZM10.9665 0.5H3.7665C3.1065 0.5 2.5665 1.04 2.5665 1.7V8.9C2.5665 9.56 3.1065 10.1 3.7665 10.1H10.9665C11.6265 10.1 12.1665 9.56 12.1665 8.9V1.7C12.1665 1.04 11.6265 0.5 10.9665 0.5ZM6.1665 8V2.6L9.4485 5.06C9.6105 5.18 9.6105 5.42 9.4485 5.54L6.1665 8Z"
                    fill="#2A2B39"
                  />
                </svg>,
                'Send any recorded video or audio file'
              )}
              {renderNavButtonItem(
                'CTA-Link',
                <svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" id="Outlined" xmlns="http://www.w3.org/2000/svg">
                  <title />

                  <g id="Fill">
                    <path d="M29.35,6.88,25.11,2.63a3,3,0,0,0-4.23,0L14.64,8.81a3,3,0,0,0,0,4.25l1.44,1.45-1.54,1.54-1.42-1.42a3,3,0,0,0-4.24,0L2.65,20.8a3,3,0,0,0,0,4.26L6.88,29.3A3,3,0,0,0,9,30.17a3,3,0,0,0,2.11-.86l6.23-6.19A3,3,0,0,0,18.24,21a3,3,0,0,0-.88-2.13L16,17.46l1.54-1.54,1.39,1.38a3,3,0,0,0,4.23,0l6.23-6.18A2.94,2.94,0,0,0,30.23,9,3,3,0,0,0,29.35,6.88ZM15.94,20.29a1,1,0,0,1,.3.71,1,1,0,0,1-.3.7L9.71,27.89a1,1,0,0,1-1.41,0L4.06,23.64a1,1,0,0,1-.3-.71,1,1,0,0,1,.3-.71L10.29,16a1,1,0,0,1,1.41,0l1.42,1.42-2.83,2.83,1.42,1.42,2.83-2.83Zm12-10.58L21.7,15.89a1,1,0,0,1-1.41,0l-1.38-1.38,2.8-2.8-1.42-1.42-2.8,2.8-1.44-1.44a1,1,0,0,1,0-1.42l6.23-6.18A1,1,0,0,1,23,3.76a1,1,0,0,1,.71.29l4.24,4.24a1,1,0,0,1,0,1.42Z" />
                  </g>
                </svg>,
                'Call to action link.',
                null,
                !ctaStatus,
                'Please switch on the CTA link from Account Settings'
              )}
            </ul>
          </div>
        </nav>
      ) : null}
      <div className="container bg-white">
        {displayComp === 'Message' && <MessageTemplate appendToBody={handleInsertion} close={setDisplayComp} />}
        {displayComp === 'ChatGpt' && <ChatGpt appendToBody={handleInsertion} close={setDisplayComp} />}
        <div id="preview-uploaded-video">
          <VideoPreview />
        </div>
      </div>
      {!expand && (
        <div id="footermessage" className=" w-full">
          <div className="container bg-white mb-2">
            <ChatWindowSelection />
            <MessageWindow flashTrigger={flashTrigger} />
          </div>
          {displayComp === 'Giphy' && <GiphyWindow appendToBody={handleInsertion} />}
          {displayComp === 'Emoji' && <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled />}
          <nav className="navbar px-2" id="messageFooter">
            <div class="navbar-brand lh-0 py-0 d-flex flex-row">
              <ul className="nav">
                {renderNavItem('Giphy', <HiMiniGif id="giphy" />, 'Send your favorite GIFs to Mail')}

                {renderNavItem(
                  'Emoji',
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      id="emoji"
                      d="M11.625 8.25C11.9375 8.25 12.2031 8.14063 12.4219 7.92188C12.6406 7.70312 12.75 7.4375 12.75 7.125C12.75 6.8125 12.6406 6.54688 12.4219 6.32812C12.2031 6.10937 11.9375 6 11.625 6C11.3125 6 11.0469 6.10937 10.8281 6.32812C10.6094 6.54688 10.5 6.8125 10.5 7.125C10.5 7.4375 10.6094 7.70312 10.8281 7.92188C11.0469 8.14063 11.3125 8.25 11.625 8.25ZM6.375 8.25C6.6875 8.25 6.95312 8.14063 7.17188 7.92188C7.39063 7.70312 7.5 7.4375 7.5 7.125C7.5 6.8125 7.39063 6.54688 7.17188 6.32812C6.95312 6.10937 6.6875 6 6.375 6C6.0625 6 5.79688 6.10937 5.57812 6.32812C5.35937 6.54688 5.25 6.8125 5.25 7.125C5.25 7.4375 5.35937 7.70312 5.57812 7.92188C5.79688 8.14063 6.0625 8.25 6.375 8.25ZM9 13.125C9.85 13.125 10.6219 12.8844 11.3156 12.4031C12.0094 11.9219 12.5125 11.2875 12.825 10.5H5.175C5.4875 11.2875 5.99062 11.9219 6.68437 12.4031C7.37812 12.8844 8.15 13.125 9 13.125ZM9 16.5C7.9625 16.5 6.9875 16.3031 6.075 15.9094C5.1625 15.5156 4.36875 14.9813 3.69375 14.3063C3.01875 13.6313 2.48438 12.8375 2.09063 11.925C1.69687 11.0125 1.5 10.0375 1.5 9C1.5 7.9625 1.69687 6.9875 2.09063 6.075C2.48438 5.1625 3.01875 4.36875 3.69375 3.69375C4.36875 3.01875 5.1625 2.48438 6.075 2.09063C6.9875 1.69687 7.9625 1.5 9 1.5C10.0375 1.5 11.0125 1.69687 11.925 2.09063C12.8375 2.48438 13.6313 3.01875 14.3063 3.69375C14.9813 4.36875 15.5156 5.1625 15.9094 6.075C16.3031 6.9875 16.5 7.9625 16.5 9C16.5 10.0375 16.3031 11.0125 15.9094 11.925C15.5156 12.8375 14.9813 13.6313 14.3063 14.3063C13.6313 14.9813 12.8375 15.5156 11.925 15.9094C11.0125 16.3031 10.0375 16.5 9 16.5ZM9 15C10.675 15 12.0938 14.4188 13.2563 13.2563C14.4188 12.0938 15 10.675 15 9C15 7.325 14.4188 5.90625 13.2563 4.74375C12.0938 3.58125 10.675 3 9 3C7.325 3 5.90625 3.58125 4.74375 4.74375C3.58125 5.90625 3 7.325 3 9C3 10.675 3.58125 12.0938 4.74375 13.2563C5.90625 14.4188 7.325 15 9 15Z"
                      fill="white"
                    />
                  </svg>,
                  'Add emotions'
                )}
                {renderNavItem('Upload Video', <MdOutlineFileUpload id="upload-video" color="white" />, 'Upload video from your device (80mb max limit)')}

                {message && (
                  <li id="save-custom-message" className="cursor-pointer" onClick={() => saveMessageAsTemplate()}>
                    <a className={'px-1text-white'} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Save the customized message as template.">
                      <svg className="mt-1 mx-2" width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="white" />
                      </svg>
                      <span className="d-none d-sm-inline">Save custom message</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="d-flex flex-row  align-items-right me-2">
              <button id="copy-message" className="copy-icon" onClick={handleCut} title="Cut the message">
                <TbCut title="Cut the message" />
              </button>
              {isMatchingUrl && (
                <button id="copy-message" className="copy-icon" onClick={handleCopy} title="Copy the message">
                  <FaRegClipboard title="Copy the message" />
                </button>
              )}
              <button id="send-button" className="btn send-button d-flex me-2 align-items-center justify-content-center" type="button" onClick={isMatchingUrl ? handleInsertionToWebsite : handleCopy}>
                {isMatchingUrl ? 'Send' : 'Copy'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export default MessageComposer
